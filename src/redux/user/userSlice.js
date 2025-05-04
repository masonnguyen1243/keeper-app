import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizeAxiosInstance from "~/utilities/authorizeAxios";
import { API_ROOT } from "~/utilities/constants";

//Khởi tạo giá trị State của một Slice trong Redux
const initialState = {
  currentUser: null,
};

//Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserApi = createAsyncThunk(
  "user/loginUserApi",
  async (data) => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );

    //Axios sẽ trả kết quả qua properties là data
    return response.data;
  }
);

//Khởi tạo một cái Slice trong kho lưu trữ - Redux store
export const userSlice = createSlice({
  name: "user",
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  //extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserApi.fulfilled, (state, action) => {
      //action.payload là cái response.data trả về ở trên
      const user = action.payload;
      state.currentUser = user;
    });
  },
});

//Action là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
//Để ý ở trên thì k thấy properties actions đâu cả, bởi những action này đơn giản là được thằng redux tạo tự động theo tên của reducer
// export const {} = userSlice.actions;

//Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

//Cái file này tên là userSlice nhưng chúng ta sẽ export ra 1 thứ tên là reducer
// export default userSlice.reducer;
export const userReducer = userSlice.reducer;
