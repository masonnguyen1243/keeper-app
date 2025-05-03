import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "~/utilities/formatters";

//Khởi tạo 1 đối tượng Axios (authorizeAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizeAxiosInstance = axios.create();

//Thời gian chờ tối đa của 1 request: để 10 phút
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10; //10p

//withCredential: Sẽ cho phép axios gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT Token (refresh and access) vào httpOnly Cookie của trình duyệt)
authorizeAxiosInstance.defaults.withCredentials = true;

/*
  Cấu hình Interceptors (bộ đánh chặn) giữa mọi Request and Response
  https://axios-http.com/docs/interceptors
 */

// Interceptors request can thiệp vào giữa những cái request API
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true);

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Interceptors response can thiệp vào giữa những cái response API nhận về
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false);

    return response;
  },
  (error) => {
    // Mọi mã http status code nằm ngoài 200 - 299 sẽ là error và rơi vào đây
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false);

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết 1 lần: Clean code)
    // console.log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }

    //Dùng toastify để hiển thị bất kể lỗi trên màn hình - ngoại trừ 410 - GONE: phục vụ việc tự đóng refresh lại token
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default authorizeAxiosInstance;
