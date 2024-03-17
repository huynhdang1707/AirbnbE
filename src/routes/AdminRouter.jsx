import React from 'react';
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

function AdminRouter({children}) {
    const {user} = useSelector((state) => state.user);

    // nếu chưa có đăng nhập và mã loại người dùng ko phải là quản trị, điều hướng về trang Home
    if(!user || user.user.role !== "ADMIN") {
        return <Navigate to="/" replace/>
    }

    // TH đã đăng nhập -> cho phép truy cập
    
  return children;
}

export default AdminRouter