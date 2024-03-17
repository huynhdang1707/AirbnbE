import React from "react";
import Header from "../../component/Header/Header.jsx"
import { Outlet } from "react-router-dom";
function AuthLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default AuthLayout;
