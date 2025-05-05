/* eslint-disable react/prop-types */
import { Route, Routes, Navigate, Outlet } from "react-router-dom";

import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
import Auth from "~/pages/Auth/Auth";
import AccountVerification from "~/pages/Auth/AccountVerification";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoutes = ({ user }) => {
  console.log(user);

  if (!user) return <Navigate to={"/login"} replace={true} />;

  return <Outlet />;
};

const App = () => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Redirect route */}
      <Route
        path="/"
        element={
          //Ở đây cần replace={true} để nó thay thế route /, có thể hiểu là route / sẽ không nằm trong history của Browser
          //Thực hành dễ hiểu hơn bằng cách nhấn Go home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace và không có
          <Navigate to={"/boards/681450b1fe2cf468e42a5c29"} replace={true} />
        }
      />

      {/* Protected Routes: Hiểu đơn giản trong dự án của chúng ta là những route chỉ truy cập sau khi đã login */}
      <Route element={<ProtectedRoutes user={currentUser} />}>
        {/* <Outlet/> cuar react-router-dom sẽ chạy vào các child trong route này */}

        {/* Board details */}
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
