import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { fetchBoardDetailsAPI } from "~/apis";
import { createNewColumnAPI, createNewCardAPI } from "~/apis";
import { generatePlaceholderCard } from "~/utilities/formatters";
import { isEmpty } from "lodash";
import { updateBoardDetailsAPI } from "~/apis";

const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "6740746e2ff60ee2a2824d3c";
    //Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      //Khi F5 thì cần xử lý lỗi kéo thả vào 1 column rỗng
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        }
      });

      setBoard(board);
    });
  }, []);

  //Gọi API tạo mới column và làm lại dữ liệu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    //Khi tạo column mới thì nó sẽ chưa có card => cần xử lý vấn đề kéo thả
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    //Cập nhật lại state board
    //Phía FE tự cập nhật lại state data board thay vì phải gọi lại API fetchBoardDetailsAPI()
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);

    setBoard(newBoard);
  };

  //Gọi API tạo mới card và làm lại dữ liệu state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    console.log(createdCard);

    //Cập nhật lại state board
    //Phía FE tự cập nhật lại state data board thay vì phải gọi lại API fetchBoardDetailsAPI()
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );

    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }

    setBoard(newBoard);
  };

  //Gọi API tạo mới card và xử lý khi kéo thả column
  const moveColumns = async (dndOrderedColumns) => {
    //Cập nhật lại cho chuẩn DL State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    //Call API update board
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  );
};

export default Board;
