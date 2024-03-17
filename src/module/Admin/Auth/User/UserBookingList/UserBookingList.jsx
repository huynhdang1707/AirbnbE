import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { apiGetBookingListUserId } from "../../../apis/bookingManagementAPI";
import { apiDeleteBooking } from "../../../apis/bookingManagementAPI";
import BookingForm from "../../BookingForm/BookingForm";
import swal from "sweetalert";
import { bookingUpdated } from "../../../slices/updateBookingSlice";
import "./UserBookingList.scss";

function UserBookingList() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingList, setBookingList] = useState(null);
  const deleteBooking = useRef(null);
  const { user } = useSelector((state) => state.user);
  const { updated } = useSelector((state) => state.updateBooking);
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiGetBookingListUserId(user?.user?.id);
        setBookingList(data.content);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [updated, deleteBooking]);
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
      setIsLoading(true);
      if (willSuccess) {
        try {
          const data = apiDeleteBooking(bookingId);
          console.log(data);
          deleteBooking.current = data;
        } catch (error) {
          console.log(error);
        }
        swal({
          title: `Xóa booking thành công`,
          text: "Nhấn Ok để tiếp tục!",
          icon: "success",
        }).then((willSuccess) => {
          const fetch = async () => {
            try {
              const data = await apiGetBookingListUserId(user?.user?.id);
              setBookingList(data.content);
            } catch (error) {
              console.log(error);
            }
          };
          fetch();
          setIsLoading(false);
          deleteBooking.current = null;
        });
      }
    });
  };
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
      <div>
        <Container>
          <h2 className="danhSachPhong">Danh sách phòng đã đặt</h2>
          <div className="body">
            <div className="container">
              <div className="row">
                <div className="table-responsive">
                  <table className="table tableuserbooking">
                    <thead>
                      <tr className="th1">
                        <th scope="col">#</th>
                        <th scope="col">ID</th>
                        <th scope="col">Mã phòng</th>
                        <th scope="col">Ngày đến</th>
                        <th scope="col">Ngày đi</th>
                        <th scope="col">Số lượng khách</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingList?.map((item, index) => {
                        const den = new Date(item.ngayDen);
                        const di = new Date(item.ngayDi);
                        return (
                          <tr key={index} className="th2">
                            <th>{index + 1}</th>
                            <td>{item.id}</td>
                            <td>{item.maPhong}</td>
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
      </div>
      ;
    </>
  );
}

export default UserBookingList;
