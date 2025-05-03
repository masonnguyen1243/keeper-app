import { Route, Routes, Navigate } from "react-router-dom";

import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
import Auth from "~/pages/Auth/Auth";

const App = () => {
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

      {/* Board details */}
      <Route path="/boards/:boardId" element={<Board />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
