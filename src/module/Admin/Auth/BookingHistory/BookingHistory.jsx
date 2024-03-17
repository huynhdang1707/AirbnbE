import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { getBookingList } from "../../slices/bookingListSlice";
import { apiDeleteBooking } from "../../apis/bookingManagementAPI";
import { bookingUpdated } from "../../slices/updateBookingSlice";
import "./BookingHistory.scss";
import BookingForm from "../BookingForm/BookingForm";
import { apiGetBookingListBookingId } from "../../apis/bookingManagementAPI";
import { apiGetBookingListUserId } from "../../apis/bookingManagementAPI";
import { Container } from "react-bootstrap";

function BookingHistory() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [searchInput1, setSearchInput1] = useState(null);
  const [searchInput2, setSearchInput2] = useState(null);
  const [bookingList, setBookingList] = useState(null);
  const [del, setDel] = useState(false);
  const [delBook, setDelBook] = useState(null);
  const deleteBooking = useRef(null);
  //Search by name
  const handleInput1 = (evt) => {
    if (evt?.key == "Enter" || evt?.key == "Tab") {
      setSearchInput1(evt?.target?.value);
    }
  };
  const handleInput2 = (evt) => {
    if (evt?.key == "Enter" || evt?.key == "Tab") {
      setSearchInput2(evt?.target?.value);
    }
  };
  const { bookings, isLoading, error } = useSelector(
    (state) => state.bookingList
  );
  const { updated } = useSelector((state) => state.updateBooking);

  useEffect(() => {
    if (searchInput1 !== "") {
      const fetch = async () => {
        try {
          const data = await apiGetBookingListBookingId(searchInput1);
          setBookingList([data.content]);
        } catch (error) {
          console.log(error);
        }
      };
      fetch();
    } else {
      const fetch = async () => {
        const data = await dispatch(getBookingList());
        const tryyy = data?.payload?.filter(
          (obj) => new Date(obj.ngayDi) > new Date()
        );
        setBookingList(tryyy);
      };
      fetch();
    }
  }, [searchInput1, del, updated]);

  useEffect(() => {
    if (searchInput2 !== "") {
      const fetch = async () => {
        try {
          const data = await apiGetBookingListUserId(searchInput2);
          setBookingList(data.content);
        } catch (error) {
          console.log(error);
        }
      };
      fetch();
    } else {
      const fetch = async () => {
        const data = await dispatch(getBookingList());
        const tryyy = data?.payload?.filter(
          (obj) => new Date(obj.ngayDi) > new Date()
        );
        setBookingList(tryyy);
      };
      fetch();
    }
  }, [searchInput2, del, updated]);

  useEffect(() => {
    const fetch = async () => {
      const data = await dispatch(getBookingList());
      const tryyy = data?.payload?.filter(
        (obj) => new Date(obj.ngayDi) > new Date()
      );
      setBookingList(tryyy);
    };
    fetch();
  }, [updated, del, updated]);

  const [updateBooking, setUpdateBooking] = useState();
  const handleUpdateBooking = (index) => {
    setUpdateBooking(bookingList[index]);
    setShow(true);
    dispatch(bookingUpdated(false));
  };
  const handleDeleteBooking = async (bookingId, index) => {
    await swal({
      title: "Bạn có muốn xóa booking?",
      text: "Nhấn Ok để tiếp tục!",
      icon: "warning",
      buttons: true,
    }).then((willSuccess) => {
      if (willSuccess) {
        try {
          const data = apiDeleteBooking(bookingId);
          setDelBook(data);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  useEffect(() => {
    if (delBook) {
      swal({
        title: `Xóa booking thành công`,
        text: "Nhấn Ok để tiếp tục!",
        icon: "success",
      }).then((willSuccess) => {
        dispatch(getBookingList());
        deleteBooking.current = null;
      });
    }
    setDelBook(null);
    setDel(!del);
  }, [delBook]);
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
      <Container>
        <h2 className="tieuDeBK">Danh sách booking còn hiệu lực</h2>
        <div className="d-flex justify-content-around mt-3">
          <div className="w-75">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Nhập mã booking và Enter"
              name="inputValue"
              onKeyDown={handleInput1}
            />
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Nhập mã người dùng và Enter"
              name="inputValue"
              onKeyDown={handleInput2}
            />
          </div>
        </div>
        <div className="body mt-2">
          <div className="container">
            <div className="row">
              <div className="table-responsive">
                <table className="table tablebooking">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Mã phòng</th>
                      <th>Mã người dùng</th>
                      <th>Ngày đến</th>
                      <th>Ngày đi</th>
                      <th>Số lượng khách</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingList?.map((item, index) => {
                      const den = new Date(item.ngayDen);
                      const di = new Date(item.ngayDi);
                      return (
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.maPhong}</td>
                          <td>{item.maNguoiDung}</td>
                          <td>{`${
                            den.getDate() < 10
                              ? "0" + den.getDate()
                              : den.getDate()
                          }/${
                            den.getMonth() + 1 < 10
                              ? "0" + (den.getMonth() + 1)
                              : den.getMonth() + 1
                          }/${den.getFullYear()}`}</td>
                          <td>{`${
                            di.getDate() < 10
                              ? "0" + di.getDate()
                              : di.getDate()
                          }/${
                            di.getMonth() + 1 < 10
                              ? "0" + (di.getMonth() + 1)
                              : di.getMonth() + 1
                          }/${di.getFullYear()}`}</td>
                          <td>{item.soLuongKhach}</td>
                          <td>
                            <button
                              className="btn text-secondary me-1 border-warning mt-1"
                              onClick={() => handleUpdateBooking(index)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn text-danger border-success mt-1"
                              onClick={() =>
                                handleDeleteBooking(item.id, index)
                              }
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <BookingForm
          onShow={show}
          handleShow={handleShow}
          onUpdateBooking={updateBooking}
        />
      </Container>
    </>
  );
}

export default BookingHistory;
