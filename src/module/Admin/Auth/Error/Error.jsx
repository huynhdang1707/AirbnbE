import React from "react";
import "./Error.scss";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  return (
    <div className="body bg-bg-pink-color">
      <div className="container text-center">
        <div className="title">404</div>
        <h1>Page Not Found</h1>
        <p className="">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã xảy ra lỗi!
        </p>
        <a onClick={() => navigate("/")} className="btn">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}

export default Error;
