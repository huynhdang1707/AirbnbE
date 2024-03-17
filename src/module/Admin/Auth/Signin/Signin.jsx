import React from "react";
import { Form } from "react-bootstrap";
import "./SignIn.scss";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signin } from "../../../slices/userSlice";
import swal from "sweetalert";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const { user, isLoading, error } = useSelector((state) => state.user);

  const onSubmit = (data) => {
    dispatch(signin(data));
  };
  const onError = (error) => {
    console.log(error);
  };
  const handleSignUpRedirect = () => {
    // Lấy giá trị redirectUrl từ query parameters
    const redirectUrl = location.state?.redirectUrl;
    navigate("/signup", { state: { redirectUrl } });
  };

  if (user) {
    const url = searchParams.get("redirectUrl");
    swal({
      title: "Bạn đã đăng nhập thành công",
      text: "Nhấn Ok để tiếp tục!",
      icon: "success",
    }).then((willSuccess) => {
      if (willSuccess) {
        const redirectUrl = location.state?.redirectUrl;
        navigate(url || redirectUrl || "/");
      }
    });
  }

  if (isLoading)
    return (
      <div className="h-100vh d-flex justify-content-center align-items-center">
        <img src="img/loading.gif" alt="" />
      </div>
    );

  return (
    <>
      <div className="login template d-flex justify-content-center align-items-center 100-w 100-vh bg-light">
        <div className="form_container p-5 rounded bg-white">
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <h3 className="text-center">Đăng nhập</h3>
            <div className="mb-2">
              <label htmlFor="email">Email</label>
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: "(*)Email không được để trống",
                  },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "(*)Email không đúng định dạng",
                  },
                })}
                type="email"
                placeholder="Nhập email"
                className="form-control"
              />
              {errors.email && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="password">Mật khẩu</label>
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "(*)Mật khẩu không được để trống",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message:
                      "(*)Mật khẩu có ít nhất 8 ký tự bao gồm 1 ký tự hoa, thường và ký tự đặc biệt.",
                  },
                })}
                type="password"
                placeholder="Nhập mật khẩu"
                className="form-control"
              />
              {errors.password && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="d-grid">
              <button className="btn nut" disabled={isLoading ? true : false}>
                Đăng nhập
              </button>
            </div>
            <p className="text-end mt-2">
              <a href="#">Quên mật khẩu?</a>
              <a
                className="ms-2"
                onClick={handleSignUpRedirect}
                disabled={isLoading ? true : false}
              >
                Đăng ký
              </a>
            </p>
            {error && (
              <p className="ms-3 fs-7 text-danger fst-italic text-center">{error}</p>
            )}
          </Form>
        </div>
      </div>
    </>
  );
}

export default Signin;
