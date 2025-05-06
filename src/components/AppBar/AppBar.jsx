import { useState } from "react";
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Box from "@mui/material/Box";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
import AppsIcon from "@mui/icons-material/Apps";
import { InputAdornment, Typography } from "@mui/material";
import WorkSpaces from "./Menus/WorkSpaces";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profiles from "./Menus/Profiles";
import Button from "@mui/material/Button";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const AppBar = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trello.appBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          paddingX: 2,
          overflowX: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AppsIcon sx={{ color: "white" }} />
          <Link to={"/"}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {/* <BookmarkIcon /> */}
              <SpaceDashboardIcon sx={{ color: "white" }} fontSize="small" />
              <Typography
                variant="span"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Keeper
              </Typography>
            </Box>
          </Link>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <WorkSpaces />
            <Recent />
            <Starred />
            <Templates />
            <Button
              sx={{
                color: "white",
                border: "none",
                "&:hover": {
                  border: "none",
                },
              }}
              variant="outlined"
              startIcon={<LibraryAddIcon />}
            >
              Create
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            id="outlined-search"
            label="Search..."
            type="text"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    onClick={() => setSearchValue("")}
                    fontSize="small"
                    sx={{
                      color: searchValue ? "white" : "transparent",
                      cursor: "pointer",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: "120px",
              maxWidth: "180px",
              "& label": { color: "white" },
              "& input": { color: "white" },
              "& label.Mui-focused": { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />

          <ModeSelect />

          <Tooltip title="Notifications">
            <Badge color="warning" variant="dot" sx={{ cursor: "pointer" }}>
              <NotificationsNoneIcon sx={{ color: "white" }} />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ cursor: "pointer", color: "white" }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
    </>
  );
};

export default AppBar;
