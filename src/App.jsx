import Button from "@mui/material/Button";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { pink } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <>
      <div>Mason</div>

      <Typography variant="body2" color="text.secondary">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
        cupiditate dicta culpa harum fugit voluptatem voluptatibus eligendi
        libero error vitae.
      </Typography>

      <Button variant="text">Text</Button>
      <Button variant="contained" color="success">
        Contained
      </Button>
      <Button variant="outlined">Outlined</Button>

      <br />

      <AccessAlarmIcon />
      <ThreeDRotation />
      <SchoolOutlinedIcon />

      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
      <HomeIcon sx={{ color: pink[100] }} />
    </>
  );
}

export default App;
