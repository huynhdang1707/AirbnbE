import React from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../component/Header/Header";
import Footer from "../../component/footer/Footer";
function MainLayout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handleLoginRedirect = () => {
    // Lấy giá trị redirectUrl từ query parameters
    const redirectUrl = window.location.pathname;
    // searchParams.set('redirectUrl', window.location.pathname);
    console.log(redirectUrl);

    // Chuyển hướng đến trang đăng nhập và truyền redirectUrl qua state
    navigate("/signin", { state: { redirectUrl } });
  };
  const handleSignUpRedirect = () => {
    // Lấy giá trị redirectUrl từ query parameters
    const redirectUrl = window.location.pathname;
    navigate("/signup", { state: { redirectUrl } });
  };
  const handleLogoutRedirect = () => {
    // Lấy giá trị redirectUrl từ query parameters
    const redirectUrl = window.location.pathname;
    // navigate(redirectUrl,{ state: { redirectUrl } });
    sessionStorage.setItem('currentPath', redirectUrl);
  };
  return (
    <div>
      <Header
        onLoginRedirect={handleLoginRedirect}
        onHandleSignUpRedirect={handleSignUpRedirect}
        onHandleLogoutRedirect={handleLogoutRedirect}
      />

      <Outlet />

      <Footer />
    </div>
  );
}

export default MainLayout;
