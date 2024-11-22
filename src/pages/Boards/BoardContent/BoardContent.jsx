/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utilities/sort";
import {
  DndContext,
  PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { useEffect, useState, useCallback, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utilities/formatters";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

const BoardContent = ({ board }) => {
  const pointerSensor = useSensor(PointerSensor, {
    //https://docs.dndkit.com/api-documentation/sensors
    activationConstraint: { distance: 10 },
  });

  //Yeu cau chuot di chuyen 10px thi moi kich hoat event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  //Nhan giu 250ms va dung sai cua cam ung 500px thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  //Cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemIdType] = useState(null);
  const [activeDragItemData, setActiveDragItemIdData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  //Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  //Cập nhật lại State trong trường hợp di chuyển Card giữa các Column
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      //Tìm vị trí index của overCard trong column đích (nơi activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      //Logic tính toán "cardIndex" mới (trên hoặc dưới overCard) lấy chuẩn ra từ code của thư viện dnd kit
      let newCardIndex;
      const isBelowOverItem =
        //rect = vị trí của phần tử so với khung hình
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.card?.length + 1;

      //Clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi return
      //- cập nhật lại OrderedColumnState mới
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      //Column cũ
      if (nextActiveColumn) {
        //Xóa card ở column active (column cũ)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //Thêm Placeholder Card nếu Column bị rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      //Column mới
      if (nextOverColumn) {
        //Kiểm tra xem cái card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card
        //giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        //Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí Index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        //Xóa Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      return nextColumns;
    });
  };

  //Tìm 1 cái column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  //Khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemIdType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemIdData(event?.active?.data?.current);

    //Nếu mà kéo Card thì mới thực hiện hành động sét giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  //Khi bắt đầu kéo 1 phần tử
  const handleDragOver = (event) => {
    //Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    //Còn nếu kéo thả Card thì xử lý thêm để có thể kéo Card qua lại giữa các Column
    // console.log("handleDragOver", event);
    const { active, over } = event;

    //Kiem tra neu ko ton tai over (keo ra ngoai thi return luon)
    if (!active || !over) return;

    //activeDraggingCardData là cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;

    //overCardId là cái card đang tương tác trên hoặc dưới so với các card đang được kéo ở trên
    const { id: overCardId } = over;

    //Tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    //Nếu k tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return;

    //Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu
    //thì không làm gì cả
    //Vì đây đang là giai đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề
    //khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  //Khi kết thúc kéo 1 phần tử
  const handleDragEnd = (event) => {
    // console.log("handleDragEnd", event);

    const { active, over } = event;

    //Kiem tra neu ko ton tai 1 trong 2 (keo ra ngoai thi return luon) thi k lam gi ca
    if (!active || !over) return;

    //Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCardData là cái card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;

      //overCardId là cái card đang tương tác trên hoặc dưới so với các card đang được kéo ở trên
      const { id: overCardId } = over;

      //Tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      //Nếu k tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return;

      //Hành động kéo thả giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        //Hành động kéo thả card trong cùng 1 column

        //Lay vi tri cu tu oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (card) => card._id === activeDragItemId
        );
        //Lay vi tri moi tu overColumn
        const newCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );

        //Dùng arrayMove vì kéo card trong 1 column tương tự với logic kéo column trong 1 cái board content
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );

        setOrderedColumns((prevColumns) => {
          //Clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi return
          //- cập nhật lại OrderedColumnState mới
          const nextColumns = cloneDeep(prevColumns);

          //Tìm tới Cloumn mà chúng ta đang thả
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );

          //Cập nhật lại 2 giá trị mới là card à cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          console.log("targetColumn", targetColumn);

          //Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns;
        });
      }
    }

    //Xử lý kéo thả Column trong boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Neu vi tri sau khi keo tha khac voi vi tri ban dau
      if (active.id !== over.id) {
        //Lay vi tri cu tu active
        const oldColumnIndex = orderedColumns.findIndex(
          (column) => column._id === active.id
        );
        //Lay vi tri moi tu over
        const newColumnIndex = orderedColumns.findIndex(
          (column) => column._id === over.id
        );

        //Dung arrayMove de sap xep lai array column ban dau
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        //Sau dung API thi dung
        // const dndOrderedColumnsIds = dndOrderedColumns.map(
        //   (column) => column._id
        // );
        // console.log("dndOrderedColumns", dndOrderedColumns);
        // console.log("dndOrderedColumnsIds", dndOrderedColumnsIds);

        //Cap nhat lai state columns ban dau sau khi da keo tha
        setOrderedColumns(dndOrderedColumns);
      }
    }

    //Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null);
    setActiveDragItemIdType(null);
    setActiveDragItemIdData(null);
    setOldColumnWhenDraggingCard(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  //args: cac doi so. tham so
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      //Tìm các điểm giao nhau va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args);

      if (!pointerIntersections?.length) return;

      //Thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây
      // const intersections =
      //   pointerIntersections?.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args);

      //Tìm cái overId đầu tiên trong đám intersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id");
      // console.log(overId);
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      //Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },

    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      //Thuật toán phát hiện va chạm
      // collisionDetection={closestCorners}

      //Fix bug xử lý va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
