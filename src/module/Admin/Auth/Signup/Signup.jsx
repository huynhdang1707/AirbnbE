import React, { useState, useEffect } from "react";
import "./Signup.scss"
import { Modal, Form, InputGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { signup } from "../../../slices/signUpSlice";
import { signin } from "../../../slices/userSlice";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("(*)Email không được để trống")
    .matches(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "(*)Email không đúng định dạng"
    ),
  password: yup
    .string()
    .required("(*)Mật khẩu không được để trống")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "(*)Mật khẩu phải có ít nhất 8 kí tự, phải có 1 chữ hoa, 1 chữ thường và 1 số"
    ),
  rePassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "(*)Mật khẩu không khớp")
    .required("(*)Vui lòng nhập lại mật khẩu"),
  name: yup.string().required("(*)Họ tên không được để trống"),
  phone: yup
    .string()
    .required("(*)Số điện thoại không được để trống.")
    .matches(
      /^0[1-9]\d{8,}$/,
      "(*)Số điện thoại phải là dãy số bắt đầu là 0 và ít nhất 10 chữ số"
    ),
  birthday: yup.string().required("(*)Ngày sinh không được để trống"),
  gender: yup.boolean().nullable().required("(*)Giới tính không được để trống").typeError("(*)Giới tính không được để trống"),
});

function Signup() {
  const dayjs = require("dayjs");
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      rePassword: "",
      phone: "",
      birthday: "",
      gender: null,
      role: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("birthday", dayjs(selectedDate).format("DD/MM/YYYY"));
  }, [selectedDate]);

  const { user, isLoading, error } = useSelector((state) => state.signup);

  const onSubmit = (data) => {
    dispatch(signup(data));
  };

  const onError = (error) => {
    console.log(error);
  };

  user &&
    swal(
      "Chúc mừng bạn đã đăng ký thành công!",
      "You clicked the button!",
      "success"
    );
  const location = useLocation();
  if (user) {
    const userSignin = {
      email: user.email,
      password: user.password,
    };
    dispatch(signin(userSignin));
    const redirectUrl = location.state?.redirectUrl;
    navigate(redirectUrl || "/");
  }
  const handleLoginRedirect = () => {
    // Lấy giá trị redirectUrl từ query parameters
    const redirectUrl = location.state?.redirectUrl;
    // searchParams.set('redirectUrl', window.location.pathname);

    // Chuyển hướng đến trang đăng nhập và truyền redirectUrl qua state
    navigate("/signin", { state: { redirectUrl } });
  };
  if (isLoading)
    return (
      <div className="h-100vh d-flex justify-content-center align-items-center">
        <img src="img/loading.gif" alt="" />
      </div>
    );
  return (
    <>
       <div className="signup template d-flex justify-content-center align-items-center 100-w 100-vh bg-light">
        <div className="form_container p-5 rounded bg-white">
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <h3 className="text-center">Đăng kí</h3>
            <div className="mb-2">
              <label htmlFor="name">Họ tên</label>
              <input type="text" placeholder="Nhập họ tên" className="form-control"  {...register("name")}  />
              {errors.name && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="email">Email</label>
              <input  {...register("email")} 
               type="email" placeholder="Nhập email" className="form-control" />
                   {errors.email && (
                      <p className="ms-3 fs-7 text-danger fst-italic">
                        {errors.email.message}
                      </p>
                    )}
            </div>
            <div className="mb-2">
              <label htmlFor="password">Mật khẩu</label>
              <input {...register("password")}    
              type="password" placeholder="Nhập mật khẩu" className="form-control"/>
              {errors.password && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="password">Nhập lại mật khẩu</label>
              <input {...register("rePassword")}    
              type="password" placeholder="Nhập lại mật khẩu" className="form-control"/>
               {errors.rePassword && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.rePassword.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="phone">Số điện thoại</label>
              <input type="tel" placeholder="Nhập số điện thoại" className="form-control" {...register("phone")}/>
              {errors.phone && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="mb-2">
            <label htmlFor="datePicker">Ngày sinh</label>
            <br />
            <DatePicker
              showIcon
              selected={selectedDate}
              maxDate={startDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<input type="text"/>}
              className="datePicker"
            />
            </div>
            <div className="mb-2">
                <select
                  className="form-control"
                  name=""
                  {...register("gender")}
                >
                  <option value="">Chọn giới tính</option>
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </select>
                {errors.gender && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="d-grid">
              <button className="btn nut" disabled={isLoading ? true : false}>Đăng kí</button>
            </div>
            <p className="text-end mt-2">
              <a onClick={() => handleLoginRedirect()}
                disabled={isLoading ? true : false}>Đã có tài khoản, đăng nhập</a>
            </p>
            {error && (
                <p className="ms-3 fs-7 text-danger fst-italic text-center">
                  {error}
                </p>
              )}
          </Form>
        </div>
      </div>
    </>
  );
}

export default Signup;
