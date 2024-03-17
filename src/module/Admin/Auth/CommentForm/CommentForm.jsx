import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import style from "./CommentForm.module.scss";
import swal from "sweetalert";
import { commentUpdated, updateComment } from "../../slices/updateCommentSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object({
  maPhong: yup.number(),
  maNguoiBinhLuan: yup.number(),
  ngayBinhLuan: yup.string().required("(*)Ngày bình luân không được để trống"),
  noiDung: yup.string().required("(*)Nội dung không được để trống"),
  saoBinhLuan: yup.number(),
});

function CommentForm({ onShow, handleShow, onUpdateComment }) {
  //
  const dayjs = require("dayjs");
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");
  dayjs.extend(utc);
  dayjs.extend(timezone);
  //
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: 0,
      maPhong: 0,
      maNguoiDung: 0,
      ngayBinhLuan: "",
      noiDung: "",
      saoBinhLuan: 0,
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const { updated, comment, error, isLoading } = useSelector(
    (state) => state.updateComment
  );
  const onSubmit = async (value) => {
    const data = await dispatch(updateComment(value));
    if (data?.payload?.statusCode === 200) {
      swal({
        title: `Cập nhật bình luận thành công`,
        text: "Nhấn Ok để tiếp tục!",
        icon: "success",
      }).then((willSuccess) => {
        if (willSuccess) {
          handleShow(!onShow);
        }
      });
    }
    dispatch(commentUpdated(data));
  };

  const onErr = (error) => {
    console.log(error);
  };
  const [newDate, setNewDate] = useState(new Date());
  useEffect(() => {
    if (onUpdateComment) {
      if (updated) {
        setNewDate(new Date(comment?.ngayBinhLuan));
        reset({
          id: comment?.id,
          maPhong: comment?.maPhong,
          ngayBinhLuan: comment?.ngayBinhLuan,
          maNguoiBinhLuan: comment?.maNguoiBinhLuan,
          noiDung: comment?.noiDung,
          saoBinhLuan: comment?.saoBinhLuan,
        });
      } else {
        setNewDate(new Date(onUpdateComment.ngayBinhLuan));
        reset({
          id: onUpdateComment?.id,
          maPhong: onUpdateComment?.maPhong,
          ngayBinhLuan: onUpdateComment?.ngayBinhLuan,
          maNguoiBinhLuan: onUpdateComment?.maNguoiBinhLuan,
          noiDung: onUpdateComment?.noiDung,
          saoBinhLuan: onUpdateComment?.saoBinhLuan,
        });
      }
    }
  }, [onUpdateComment]);
  useEffect(() => {
    setValue(
      "ngayBinhLuan",
      dayjs(newDate)
        .utcOffset(7) // Chuyển đổi sang múi giờ UTC
        .format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
    );
  }, [newDate]);

  return (
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
            <span className="input-group-text">Mã phòng</span>
            <input
              className="form-control"
              placeholder="Mã phòng"
              {...register("maPhong")}
            />
          </div>
          {errors.maPhong && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.maPhong.message}
            </p>
          )}{" "}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Mã người dùng</span>
            <input
              type="text"
              className="form-control"
              placeholder="Mã người dùng"
              {...register("maNguoiBinhLuan")}
            />
          </div>
          {errors.maNguoiBinhLuan && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.maNguoiBinhLuan.message}
            </p>
          )}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Ngày bình luận</span>
            <DatePicker
              showIcon
              selected={newDate}
              // minDate={startDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setNewDate(date)}
              className="datePicker"
            />
          </div>
          {errors.ngayBinhLuan && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.ngayBinhLuan.message}
            </p>
          )}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Nội dung</span>
            <textarea
              type="text"
              className="form-control"
              placeholder="Nội dung"
              {...register("noiDung")}
            />
          </div>
          {errors.noiDung && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.noiDung.message}
            </p>
          )}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Số sao bình luận</span>
            <input
              type="text"
              className="form-control"
              placeholder="Số sao bình luận"
              {...register("saoBinhLuan")}
            />
          </div>
          {errors.saoBinhLuan && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.saoBinhLuan.message}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className={`${style.btnn}`}>
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
  );
}

export default CommentForm;
