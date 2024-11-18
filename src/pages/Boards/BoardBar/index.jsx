import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const MENU_STYLE = {
  color: "primary.main",
  border: "none",
  paddingX: "5px",
  backgroundColor: "white",
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: "primary.main",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
};

const BoardBar = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trello.boardBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          paddingX: 2,
          overflow: "auto",
          borderTop: "1px solid #00bfa5",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label="Mason Nguyen"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<VpnLockIcon />}
            label="Public/Private Workspace"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<AddToDriveIcon />}
            label="Add To Google Drive"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<BoltIcon />}
            label="Automation"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<FilterListIcon />}
            label="Filter"
            clickable
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" startIcon={<PersonAddIcon />}>
            Invite
          </Button>

          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": {
                width: 34,
                height: 34,
                fontSize: 16,
              },
            }}
          >
            <Tooltip title="Mason">
              <Avatar
                alt="Mason"
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
              />
            </Tooltip>
            <Tooltip title="Mason">
              <Avatar
                alt="Mason"
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
              />
            </Tooltip>
            <Tooltip title="Mason">
              <Avatar
                alt="Mason"
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
              />
            </Tooltip>
            <Tooltip title="Mason">
              <Avatar
                alt="Mason"
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
              />
            </Tooltip>
            <Tooltip title="Mason">
              <Avatar
                alt="Mason"
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
              />
            </Tooltip>
            <Tooltip title="Mason">
              <Avatar
                alt="Mason"
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
              />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  );
};

export default BoardBar;
