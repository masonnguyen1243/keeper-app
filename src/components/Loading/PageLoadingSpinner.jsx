/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const PageLoadingSpinner = ({ caption }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100vw",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  );
};
export default PageLoadingSpinner;
