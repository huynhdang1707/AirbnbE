import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getInfoUser } from "../../slices/infoUserSlice";
import "./UserInfo.scss";

import UserForm from "../UserForm/UserForm";

const schema = yup.object({
  email: yup
    .string()
    .required("(*)Email không được để trống")
    .matches(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "(*)Email không đúng định dạng"
    ),
  name: yup.string().required("(*)Họ tên không được để trống"),
  phone: yup
    .string()
    .required("(*)Số điện thoại không được để trống.")
    .matches(
      /^0[1-9]\d{8,}$/,
      "(*)Số điện thoại phải là dãy số bắt đầu là 0 và ít nhất 10 chữ số"
    ),
  birthday: yup.string().required("(*)Ngày sinh không được để trống"),
  gender: yup.boolean().required("(*)Giới tính không được để trống"),
});

function UserInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const [err, setErr] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      name: "",
      email: "",
      phone: "",
      birthday: "",
      avatar: "",
      gender: null,
      role: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const { infoUser, isLoading, error } = useSelector((state) => state.infoUser);

  useEffect(() => {
    dispatch(getInfoUser(user?.user?.id));
  }, [user?.user?.id, show]);
  const onSubmit = async (value) => {};
  useEffect(() => {
    reset({
      id: infoUser.id,
      // password: infoUser?.password,
      name: infoUser?.name,
      email: infoUser?.email,
      phone: infoUser?.phone,
      role: infoUser?.role,
      avatar: infoUser?.avatar,
      birthday: infoUser?.birthday,
      gender: infoUser?.gender,
    });
  }, [infoUser, show]);
  const onErrer = (err) => {
    console.log(err);
  };
  if (err || error) {
    navigate("/*");
  }
  const handleShow = (value) => {
    setShow(value);
  };
  if (isLoading)
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <img
          src={"/img/loading.gif"}
          className="img-fluid"
          style={{ height: "100px", width: "100px" }}
        />
      </div>
    );

  return (
    <>
      <div className="mt-3">
        <ul>
          <li>
            <a href="#">
              <div
                className="me-3"
                onClick={() => setShow(infoUser?.id ? true : false)}
              >
                <span className="me-3 chinhSua">
                  Chỉnh sửa thông tin cá nhân
                </span>
                <i className="bi bi-pencil-square"></i>
              </div>
            </a>
          </li>
          <hr className="text-dark" />
          <li>
            <a href="#">
              <span className="name">Tên: </span>
              <span>{infoUser?.name}</span>
            </a>
          </li>
          <hr className="text-dark" />
          <li>
            <span className="email">Email: </span>
            <span>{infoUser?.email}</span>
          </li>
          <hr className="text-dark" />
          <li>
            <span className="password">Mật khẩu: </span>
            <span className="">{infoUser?.password}**********</span>
          </li>
          <hr className="text-dark" />
          <li>
            <span className="phone">Số điện thoại: </span>
            <span>{infoUser?.phone}</span>
          </li>
          <hr className="text-dark" />
          <li>
            <span className="role">Loại người dùng: </span>
            <span>{infoUser?.role}</span>
          </li>
          <hr className="text-dark" />
        </ul>
      </div>
      <UserForm onShow={show} handleShow={handleShow} onUpdateUser={infoUser} />
    </>
  );
}

export default UserInfo;
