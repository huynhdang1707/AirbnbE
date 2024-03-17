import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (!user) {
    // return <Navigate to={`/signin?redireactUrl=${pathname}`} patch replace/>
    swal({
      title: "Bạn chưa đăng nhập!",
      text: "Nhấn Ok để tiếp tục!",
      icon: "warning",
    }).then((willSuccess) => {
      if (willSuccess) {
        navigate(`/signin?redirectUrl=${pathname}`, { replace: true }); 
      }
    });
  }
  // TH đã đăng nhập -> cho phép truy cập

  return children;
}

export default ProtectedRoute;
