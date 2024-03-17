import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { userUpdated, updateUser } from "../../slices/updateUserSlice";
import swal from "sweetalert";
import style from "./UserForm.module.scss";
import UploadImage from "../UploadImgage/UploadImage";

const schema = yup.object({
  email: yup
    .string()
    .required("(*)Email không được để trống")
    .matches(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "(*)Email không đúng định dạng"
    ),
  // password: yup
  //   .string()
  //   .required("(*)Mật khẩu không được để trống")
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  //     "(*)Mật khẩu phải có ít nhất 8 kí tự, phải có 1 chữ hoa, 1 chữ thường và 1 số"
  //   ),
  name: yup.string().required("(*)Họ tên không được để trống"),
  phone: yup
    .string()
    .required("(*)Số điện thoại không được để trống.")
    .matches(
      /^0[1-9]\d{8,}$/,
      "(*)Số điện thoại phải là dãy số bắt đầu là 0 và ít nhất 10 chữ số"
    ),
  birthday: yup.string().required("(*)Ngày sinh không được để trống"),
  gender: yup.boolean().required("(*)Gới tính không được để trống"),
});

function UserForm({ onShow, handleShow, onUpdateUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: userPre } = useSelector((state) => state.user);

  //upload
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [key, setKey] = useState(null);
  const [id2, setId2] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUp, setImageUp] = useState(null);
  const handleUpload = (id, img, kw) => {
    setShow(true);
    setId2(id);
    setImage(img);
    setKey(kw);
  };

  const handleShow2 = (value) => {
    setShow(value);
  };
  //
  const [passShow, setPassShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      avatar: "",
      gender: null,
      role: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const handleUploaded = (hinhAnh) => {
    setImageUp(hinhAnh);
    setValue("avatar", hinhAnh);
  };

  // const { infoUser, isLoading, error } = useSelector((state) => state.infoUser);
  const { updated, user, error, isLoading } = useSelector(
    (state) => state.updateUser
  );
  const onSubmit = async (value) => {
    const data = await dispatch(updateUser(value));
    dispatch(userUpdated(data));
    if (data?.payload?.statusCode === 200) {
      swal({
        title: `Cập nhật người dùng thành công`,
        text: "Nhấn Ok để tiếp tục!",
        icon: "success",
      }).then((willSuccess) => {
        if (willSuccess) {
          handleShow(!onShow);
          // setShow1(!show1);
        }
      });
    }
  };
  const onErr = (error) => {
    console.log(error);
  };
  useEffect(() => {
    if (onUpdateUser) {
      if (updated) {
        reset({
          id: user?.id,
          password: user?.password,
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          role: user?.role,
          avatar: imageUp ? imageUp : user?.avatar,
          birthday: user?.birthday,
          gender: user?.gender,
        });
      } else {
        reset({
          id: onUpdateUser?.id,
          password: onUpdateUser?.password,
          name: onUpdateUser?.name,
          email: onUpdateUser?.email,
          phone: onUpdateUser?.phone,
          role: onUpdateUser?.role,
          avatar:
            getValues("avatar") !== ""
              ? getValues("avatar") !== onUpdateUser?.avatar && !imageUp
                ? onUpdateUser?.avatar
                : getValues("avatar")
              : onUpdateUser?.avatar,
          birthday: onUpdateUser?.birthday,
          gender: onUpdateUser?.gender,
        });
      }
    }
  }, [onUpdateUser, imageUp, updated]);


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
      {show ? null : onShow ? (
        <Modal
          show={onShow}
          onHide={() => handleShow(!onShow)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header className="bg-pink-primary" closeButton>
            <Modal.Title className="text-header-border-color">
              Cập nhật thông tin
            </Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit(onSubmit, onErr)}>
            <Modal.Body className={style.formBody}>
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">ID</span>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  placeholder="ID"
                  {...register("id")}
                />
              </div>
              {errors.id && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.id.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Mật khẩu</span>
                <input
                  type={passShow ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu"
                  {...register("password")}
                />
                <div
                  className={`input-group-text ${style.cursor}`}
                  onClick={() => setPassShow(!passShow)}
                >
                  {passShow ? (
                    <i class="bi bi-eye-slash"></i>
                  ) : (
                    <i class="bi bi-eye"></i>
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.password.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Họ và tên</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Họ và tên"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.name.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Email</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.email.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Số điện thoại</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số điện thoại"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.phone.message}
                </p>
              )}
              {userPre?.user?.id !== onUpdateUser?.id ? (
                <div className={`input-group ${style.input}`}>
                  <span className="input-group-text">Loại người dùng</span>
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Mã loại người dùng"
                    {...register("role")}
                  >
                    <option value="ADMIN">Quản trị</option>
                    <option value="USER">Khách hàng</option>
                  </select>
                </div>
              ) : null}
              {errors.role && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.role.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Ảnh đại diện</span>
                <img
                  style={{ maxWidth: "66px" }}
                  src={imageUp ? imageUp : watch("avatar")}
                  alt=""
                />
                <input
                  value={imageUp ? imageUp : getValues("avatar")}
                  type="text"
                  className="form-control"
                  placeholder="Avatar"
                  {...register("avatar")}
                />
              </div>
              {errors.avatar && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.avatar.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Ngày sinh</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ngày sinh"
                  {...register("birthday")}
                />
              </div>
              {errors.birthday && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.birthday.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Giới tính</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Giới tính"
                  {...register("gender")}
                >
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </select>
              </div>
              {errors.gender && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.gender.message}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              {userPre?.user?.id === onUpdateUser?.id ? (
                <button
                  className={style.btn2}
                  onClick={() =>
                    handleUpload(getValues("id"), getValues("avatar"), "user")
                  }
                  type="button"
                >
                  Upload ảnh
                </button>
              ) : null}

              <button type="submit" className={` ${style.btn}`}>
                Cập nhật
              </button>
            </Modal.Footer>
            {error && (
              <div className="fs-7 text-danger fst-italic text-center mb-3">
                {error}
              </div>
            )}
          </form>
        </Modal>
      ) : null}
      <UploadImage
        handleUploaded={handleUploaded}
        onShoww={show}
        handleShow={handleShow2}
        onId={id2}
        onImg={image}
        onKey={key}
      />
    </>
  );
}

export default UserForm;
