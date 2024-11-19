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
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    console.log("handleDragEnd:", event);
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
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  );
};

export default BoardContent;
