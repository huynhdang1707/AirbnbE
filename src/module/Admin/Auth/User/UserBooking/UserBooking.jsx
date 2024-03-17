import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { Container,Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userCreateBooking } from "../../../slices/userCreateBooking";
import "./UserBooking.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function UserBooking() {
  //
  const dayjs = require("dayjs");
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");
  dayjs.extend(utc);
  dayjs.extend(timezone);
  //
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const { booking, isLoading, error } = useSelector(
    (state) => state.createBooking
  );
  const schema = yup.object({
    maPhong: yup.number(),
    ngayDen: yup.string().required("(*)Ngày đến không được để trống"),
    ngayDi: yup.string().required("(*)Quốc gia không được để trống"),
    soLuongKhach: yup
      .number()
      .max(
        booking?.soLuongKhach,
        `Số lượng khách không vượt quá lượng khách tối đa: ${booking?.soLuongKhach}`
      )
      .min(1, "Số lượng khách ít nhất là 1")
      .typeError("Số lượng khách phải là 1 số"),
    maNguoiDung: yup.number(),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const {
    user,
    isLoading: isLoading1,
    error: error1,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (booking?.ngayDen && booking?.ngayDi) {
      const den = new Date(booking?.ngayDen);
      const di = new Date(booking?.ngayDi);
      setNewStartDate(new Date(booking?.ngayDen));
      setNewEndDate(new Date(booking?.ngayDi));
      reset({
        maPhong: booking?.maPhong,
        ngayDen: getValues("ngayDen"),
        ngayDi: getValues("ngayDi"),
        soLuongKhach: booking?.soLuongKhach,
        maNguoiDung: user?.user?.id,
      });
    }
  }, []);
  const [addBooking, setAddBooking] = useState(null);
  const onSubmit = async (value) => {
    const data = await dispatch(userCreateBooking(value));
    setAddBooking(data);
  };
  const [total, setTotal] = useState(null);
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
    const ngayDen = new Date(getValues("ngayDen"));

    const ngayDi = new Date(getValues("ngayDi"));
    const millisecondsDiff = ngayDi - ngayDen + 1;

    const daysDiff = Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24));

    const millisecondsDiff1 =
      new Date(booking?.ngayDi) - new Date(booking?.ngayDen) + 1;
    const daysDiff1 = Math.ceil(millisecondsDiff1 / (1000 * 60 * 60 * 24));
    setTotal((daysDiff * booking?.totalPrice) / daysDiff1);
  }, [newStartDate, newEndDate]);

  const onError = (errors) => {
    console.log(errors);
  };
  const [startDate, setStartDat] = useState(new Date());
  if (addBooking?.payload?.statusCode === 201) {
    swal({
      title: `Đặt phòng thành công với thanh toán ${
        total ? total : booking?.totalPrice
      }.000.000đ`,
      text: "Nhấn Ok để tiếp tục!",
      icon: "success",
    }).then((willSuccess) => {
      if (willSuccess) {
        navigate("/user/booking-list");
      }
    });
  }

  if (isLoading)
    return (
      <div className="h-100vh d-flex justify-content-center align-items-center">
        <img src="img/loading.gif" alt="" />
      </div>
    );
  if (!user) {
    return <div></div>;
  }

  return (
    <> 
      <div>
        <Container>
            <h2>Thông tin phòng</h2>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div>
                <label htmlFor="text">Tên người dùng</label>
                <input
                    type="text"
                    className="w-100 form-control"
                    value={user?.user?.name}
                  />
              </div>
              <div>
                <label htmlFor="text">Tên phòng</label>
                <input
                    type="text"
                    className="w-100 form-control"
                    value={booking?.tenPhong}
                  />
              </div>
              <div>
                <label htmlFor="text">Hình ảnh</label>
                <br />
                <img
                    style={{ maxWidth: "150px" }}
                    src={booking?.hinhPhong}
                    alt={booking?.tenPhong}
                  />
              </div>
              <div>
                <label htmlFor="text">Số lượng khách</label>
                <input
                    type="text"
                    className="w-100 form-control"
                    {...register("soLuongKhach")}
                  />
                  {errors.soLuongKhach && (
                    <p className="ms-3 fs-7 text-danger fst-italic">
                      {errors.soLuongKhach.message}
                    </p>
                  )}
              </div>
              <div className="d-flex">
                <div className="me-2">
                  <label htmlFor="text">Ngày nhận phòng</label>
                  <br />
                  <DatePicker
                      showIcon
                      selected={newStartDate}
                      minDate={startDate}
                      maxDate={newEndDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={(date) => setNewStartDate(date)}
                      className="datePicker w-100"
                    />
                    {errors.ngayDen && (
                      <p className="ms-3 fs-7 text-danger fst-italic">
                        {errors.ngayDen.message}
                      </p>
                    )}
                </div>
                <div>
                  <label htmlFor="text">Ngày trả phòng</label>
                  <br />
                  <DatePicker
                    showIcon
                    selected={newEndDate}
                    minDate={newStartDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setNewEndDate(date)}
                    className="datePicker w-100"
                  />
                  {errors.ngayDi && (
                    <p className="ms-3 fs-7 text-danger fst-italic">
                      {errors.ngayDi.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="">Tổng tiền</label>
                <input
                type="text"
                className="w-100 form-control"
                value={
                total
                ? `${total}.000.000đ`
                : `${booking?.totalPrice}.000.000đ`
                }
                />
              </div>
              <div className="text-center mt-3">
                <button type="submit" className="btn btn-outline-primary" disabled={isLoading ? true : false}>
                  Đặt phòng
                </button>
                {error && (
                  <p className="text-center fs-7 text-danger fst-italic">
                    {error}
                  </p>
                )}
              </div>
            </form>
        </Container>
      </div>
    </>
  );
}

export default UserBooking;
