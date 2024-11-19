import Box from "@mui/material/Box";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import Cloud from "@mui/icons-material/Cloud";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ContentCopy, ContentPaste } from "@mui/icons-material";
import AddCardIcon from "@mui/icons-material/AddCard";
import Button from "@mui/material/Button";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ListCards from "./ListCards/ListCards";
import { mapOrder } from "~/utilities/sort";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Column = ({ column }) => {
  //Drag and Drop
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyles = {
    //Danh cho sensor default dang sensors pointer
    touchAction: "none",

    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Sort array
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, "_id");

  return (
    <Box
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      {...listeners}
      sx={{
        minWidth: "300px",
        maxWidth: "300px",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
        ml: 2,
        borderRadius: "6px",
        height: "fit-content",
        maxHeight: (theme) =>
          `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
      }}
    >
      {/* Box column header */}
      <Box
        sx={{
          height: (theme) => theme.trello.COLUMN_HEADER_HEIGHT,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {column?.title}
        </Typography>
        <Box>
          <Tooltip title="More options">
            <ExpandMoreIcon
              sx={{ color: "text.primary", cursor: "pointer" }}
              id="basic-column-dropdown"
              aria-controls={open ? "basic-menu-column-dropdown" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            />
          </Tooltip>
          <Menu
            id="basic-menu-column-dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-column-dropdown",
            }}
          >
            <MenuItem onClick={() => handleClose()}>
              <ListItemIcon>
                <AddCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose()}>
              <ListItemIcon>
                <ContentCut fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose()}>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose()}>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>Page</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleClose()}>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose()}>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/*  list cards */}
      <ListCards cards={orderedCards} />

      {/* Box column footer */}
      <Box
        sx={{
          height: (theme) => theme.trello.COLUMN_FOOTER_HEIGHT,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button startIcon={<AddCardIcon />}>Add new card</Button>
        <Tooltip title="Drag to move">
          <DragHandleIcon sx={{ cursor: "pointer" }} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Column;
