import { Navigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";

function Auth() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  const currentUser = useSelector(selectCurrentUser);
  if (currentUser) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "flex-start",
        background: 'url("src/assets/auth/login-register-bg.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.2)",
      }}
    >
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  );
}

export default Auth;
