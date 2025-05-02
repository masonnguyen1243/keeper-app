import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "~/utilities/constants";
import { mapOrder } from "~/utilities/sort";
import { generatePlaceholderCard } from "~/utilities/formatters";
import { isEmpty } from "lodash";

//Khởi tạo giá trị State của một Slice trong Redux
const initialState = {
  currentActiveBoard: null,
};

//Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);

    //Axios sẽ trả kết quả qua properties là data
    return response.data;
  }
);

//Khởi tạo một cái Slice trong kho lưu trữ - Redux store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducers, ở đây chúng ta gán nó ra 1 biến có nghĩa hơn
      const board = action.payload;

      //Xử lý dữ liệu nếu cần thiết
      //...

      //Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board;
    },
  },
  //extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload là cái response.data trả về ở trên
      let board = action.payload;

      //Xử lý dữ liệu nếu cần thiết
      //...
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");
      //Khi F5 thì cần xử lý lỗi kéo thả vào 1 column rỗng
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });

      //Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board;
    });
  },
});

//Action là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
//Để ý ở trên thì k thấy properties actions đâu cả, bởi những action này đơn giản là được thằng redux tạo tự động theo tên của reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

//Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};

//Cái file này tên là activeBoardSlice nhưng chúng ta sẽ export ra 1 thứ tên là reducer
// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
