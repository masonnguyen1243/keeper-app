import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import { verifyUserAPI } from "~/apis";

const AccountVerification = () => {
  //Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams();

  //   const email = searchParams.get("email"); //Cach 1
  //   const token = searchParams.get("token");
  const { email, token } = Object.fromEntries([...searchParams]); //Cach 2

  //Tạo 1 state để biết được là đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false);

  //Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true));
    }
  }, [email, token]);

  //Nếu URL có vấn đề, không tồn tài 1 trong 2 giá trị email hoặc token thì đá ra trang 404
  if (!email || !token) {
    return <Navigate to={"/404"} />;
  }

  //Nếu chưa Verify xong thì hiện loading
  if (verified) {
    return <PageLoadingSpinner caption={"Verifying..."} />;
  }

  //Cuối cùng nếu k gặp vấn đề gì + Verify thành công thì điều hướng về trang Login cùng giá trị verifiedEmail

  return <Navigate to={`/login?verifiedEmail=${email}`} />;
};
export default AccountVerification;
