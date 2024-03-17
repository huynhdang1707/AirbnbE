import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import style from "./BookingForm.module.scss";
import swal from "sweetalert";
import { bookingUpdated, updateBooking } from "../../slices/updateBookingSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object({
  maPhong: yup.number(),
  ngayDen: yup.string().required("(*)Ngày đến không được để trống"),
  ngayDi: yup.string().required("(*)Quốc gia không được để trống"),
  soLuongKhach: yup.number(),
  maNguoiDung: yup.number(),
});

function BookingForm({ onShow, handleShow, onUpdateBooking }) {
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
      maPhong: null,
      ngayDen: "",
      ngayDi: "",
      soLuongKhach: 0,
      maNguoiDung: 0,
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const { updated, booking, error, isLoading } = useSelector(
    (state) => state.updateBooking
  );

  const onSubmit = async (value) => {
    const data = await dispatch(updateBooking(value));
    console.log(data);
    if (data?.payload?.statusCode === 200) {
      swal({
        title: `Cập nhật Booking thành công`,
        text: "Nhấn Ok để tiếp tục!",
        icon: "success",
      }).then((willSuccess) => {
        if (willSuccess) {
          handleShow(!onShow);
        }
      });
    }
    dispatch(bookingUpdated(data));
  };
  const onErr = (error) => {
    console.log(error);
  };
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  useEffect(() => {
    if (onUpdateBooking) {
      if (updated) {
        setNewStartDate(new Date(booking?.ngayDen));
        setNewEndDate(new Date(booking?.ngayDi));
        reset({
          id: booking?.id,
          maPhong: booking?.maPhong,
          ngayDen: booking?.ngayDen,
          ngayDi: booking?.ngayDi,
          soLuongKhach: booking?.soLuongKhach,
          maNguoiDung: booking?.maNguoiDung,
        });
      } else {
        setNewStartDate(new Date(onUpdateBooking.ngayDen));
        setNewEndDate(new Date(onUpdateBooking.ngayDi));
        reset({
          id: onUpdateBooking?.id,
          maPhong: onUpdateBooking?.maPhong,
          ngayDen: onUpdateBooking?.ngayDen,
          ngayDi: onUpdateBooking?.ngayDi,
          soLuongKhach: onUpdateBooking?.soLuongKhach,
          maNguoiDung: onUpdateBooking?.maNguoiDung,
        });
      }
    }
  }, [onUpdateBooking]);

  useEffect(() => {
    setValue(
      "ngayDen",
      dayjs(newStartDate)
        .utcOffset(7) // Chuyển đổi sang múi giờ UTC
        .format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
    );
    setValue(
      "ngayDi",
      dayjs(newEndDate)
        .utcOffset(7) // Chuyển đổi sang múi giờ UTC
        .format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
    );
  }, [newStartDate, newEndDate]);

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
              {...register("maNguoiDung")}
            />
          </div>
          {errors.maNguoiDung && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.maNguoiDung.message}
            </p>
          )}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Ngày đến</span>
            <DatePicker
              showIcon
              selected={newStartDate}
              maxDate={newEndDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setNewStartDate(date)}
              className="datePicker"
            />
          </div>
          {errors.ngayDen && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.ngayDen.message}
            </p>
          )}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Ngày đi</span>
            <DatePicker
              showIcon
              selected={newEndDate}
              minDate={newStartDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setNewEndDate(date)}
              className="datePicker"
            />
          </div>
          {errors.ngayDi && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.ngayDi.message}
            </p>
          )}
          <div className={`input-group ${style.input}`}>
            <span className="input-group-text">Số lượng khách</span>
            <input
              type="text"
              className="form-control"
              placeholder="Số lượng khách"
              {...register("soLuongKhach")}
            />
          </div>
          {errors.soLuongKhach && (
            <p className="ms-3 fs-7 text-danger fst-italic">
              {errors.soLuongKhach.message}
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

export default BookingForm;
