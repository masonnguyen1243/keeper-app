import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utilities/sort";
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  //Khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemIdType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemIdData(event?.active?.data?.current);
  };

  //Khi kết thúc kéo 1 phần tử
  const handleDragEnd = (event) => {
    const { active, over } = event;

    //Kiem tra neu ko ton tai over (keo ra ngoai thi return luon)
    if (!over) return;

    //Neu vi tri sau khi keo tha khac voi vi tri ban dau
    if (active.id !== over.id) {
      //Lay vi tri cu tu active
      const oldIndex = orderedColumns.findIndex(
        (column) => column._id === active.id
      );
      //Lay vi tri moi tu over
      const newIndex = orderedColumns.findIndex(
        (column) => column._id === over.id
      );

      //Dung arrayMove de sap xep lai array column ban dau
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      //Sau dung API thi dung
      // const dndOrderedColumnsIds = dndOrderedColumns.map(
      //   (column) => column._id
      // );
      // console.log("dndOrderedColumns", dndOrderedColumns);
      // console.log("dndOrderedColumnsIds", dndOrderedColumnsIds);

      //Cap nhat lai state columns ban dau sau khi da keo tha
      setOrderedColumns(dndOrderedColumns);
    }

    setActiveDragItemId(null);
    setActiveDragItemIdType(null);
    setActiveDragItemIdData(null);
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

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
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
