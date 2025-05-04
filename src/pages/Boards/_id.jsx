import { useEffect } from "react";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";
import { cloneDeep } from "lodash";
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const { boardId } = useParams();

  //Không dùng state của component nữa mà chuyển qua dùng state của redux

  useEffect(() => {
    // const boardId = "681450b1fe2cf468e42a5c29";

    //Call API
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  //Gọi API tạo mới card và xử lý khi kéo thả column
  //Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong Board)
  const moveColumns = async (dndOrderedColumns) => {
    //Cập nhật lại cho chuẩn DL State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    // setBoard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard));

    //Call API update board
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  //Khi di chuyển Card trong cùng 1 column
  //Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    //Cập nhật lại cho chuẩn DL State Board
    // const newBoard = { ...board };
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    // setBoard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard));

    //Call API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };

  /**
   * Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (xóa cái _id của Card khỏi mảng)
   * Cập nhật mảng cardOrderIds của Column tiếp theo (thêm cái _id của Card vào mảng)
   * Cập nhật lại columnId mới của cái Card đã kéo
   * => Tạo 1 API support riêng
   */
  const moveCardToDifferentColumns = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    //Cập nhật lại cho chuẩn DL State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    // setBoard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard));

    //Goi API
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds;

    //Xử lý vấn đề khi kéo phần tử cuối cùng ra khỏi Column
    if (prevCardOrderIds[0].includes("-placeholder-card")) {
      prevCardOrderIds = [];
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };

  if (!board) {
    return <PageLoadingSpinner caption={"Loading Board..."} />;
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        //3 cái trường hợp move dưới đây thì giữ nguyên để code xử lý kéo thả phần BoardContent k bị dài mất kiểm soát khi đọc code, maintain.
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumns={moveCardToDifferentColumns}
      />
    </Container>
  );
};

export default Board;
