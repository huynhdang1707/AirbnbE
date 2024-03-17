import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserInfo from "../../modules/UserInfo/UserInfo";
import Button from "react-bootstrap/Button";
import "./UserInfoLayout.scss";

function UserInfoLayout() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const role = user?.user?.role;
  const location = useLocation();
  const handleClick = () => {
    navigate("/admin");
  };
  const handleClick2 = () => {
    navigate("/user");
  };

  if (user) {
    return (
      <>
        <div className="container">
          <h2 className="py-4 bg-white tieuDeUS">Thông tin người dùng</h2>
          {role === "ADMIN" && location.pathname !== "/admin" ? (
            <div className="py-4">
              <Button variant="outline-secondary" onClick={handleClick}>
                Admin Page
              </Button>
            </div>
          ) : role === "USER" ? null : (
            <div className="py-4">
              <Button variant="outline-secondary" onClick={handleClick2}>
                User Page
              </Button>
            </div>
          )}
          <UserInfo />
        </div>
      </>
    );
  } else
    return (
      <div className="text-center text-danger">
        <h3>Vui lòng đăng nhập để tiếp tục</h3>
      </div>
    );
}

export default UserInfoLayout;
