import React, { useEffect, useState, useRef } from "react";
import "./AdminUserList.scss";
import Pagination from "rc-pagination";
import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { getUserListPage } from "../../../slices/userListPageSlice";
import { apiDeleteUser } from "../../../apis/userManagementAPI";
import { userUpdated } from "../../../slices/updateUserSlice";
import UserForm from "../../UserForm/UserForm";

function AdminUserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(1);
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const deleteUser = useRef(null);

  //Search by name
  const handleInput = (evt) => {
    if (evt?.key == "Enter" || evt?.key == "Tab") {
      setSearchInput(evt?.target?.value);
    }
  };

  const { users, isLoading, error } = useSelector(
    (state) => state.userListPage
  );
  const { updated } = useSelector((state) => state.updateUser);
  useEffect(() => {
    dispatch(
      getUserListPage({
        pageIndex: current,
        pageSize: 10,
        keyword: searchInput ? searchInput : null,
      })
    );
  }, [current, updated, searchInput, deleteUser]);
  const [updateUser, setUpdateUser] = useState();
  const handleUpdateUser = (index) => {
    setUpdateUser(users?.data[index]);
    setShow(true);
    dispatch(userUpdated(false));
  };

  const handleDeleteUser = async (userId, index) => {
    await swal({
      title: "Bạn có muốn xóa người dùng?",
      text: "Nhấn Ok để tiếp tục!",
      icon: "warning",
      buttons: true,
    }).then((willSuccess) => {
      if (willSuccess) {
        try {
          const data = apiDeleteUser(userId);
          //   setDeleteUser(data);
          deleteUser.current = data;
          index === 0 && users?.totalRow % 10 === 1
            ? setCurrent(current - 1)
            : setCurrent(current);
          dispatch(
            getUserListPage({
              pageIndex: current,
              pageSize: 10,
            })
          );
        } catch (error) {
          console.log(error);
        }
        swal({
          title: `Xóa người dùng thành công`,
          text: "Nhấn Ok để tiếp tục!",
          icon: "success",
        }).then((willSuccess) => {
          deleteUser.current = null;
        });
      }
    });
  };
  const PaginationChange = (page) => {
    setCurrent(page);
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
      <div className="wrapper">
        <Container>
          <h2 className="tieuDeDS">Danh sách người dùng</h2>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="w-100 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên người dùng và nhấn Enter..."
                name="inputValue"
                onKeyDown={handleInput}
              />
            </div>
            <div className="mb-3">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/admin/add-user")}
              >
                Thêm người dùng mới
              </Button>
            </div>
          </div>
          <div className="table-responsive">
            <div className="scrollable-table">
              <table className="table tableuser mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Hình ảnh</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>SĐT</th>
                    <th>Loại người dùng</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.data?.map((item, index) => {
                    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
                    return (
                      <tr key={index}>
                        <td>{index + 1 + (current - 1) * 10}</td>
                        <td>{item.id}</td>
                        <td>
                          <img
                            className="hinhAnh"
                            src={item.avatar}
                            alt={item.id}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.gender ? "Nam" : "Nữ"}</td>
                        <td>
                          {regex.test(item.birthday) ? item.birthday : ""}
                        </td>
                        <td>{item.phone}</td>
                        <td>
                          {item.role === "ADMIN" ? "Quản trị" : "Khách hàng"}
                        </td>
                        <td>
                          <button
                            className="btn text-secondary me-1 border-warning mt-1"
                            onClick={() => handleUpdateUser(index)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn text-danger border-success mt-1"
                            onClick={() => handleDeleteUser(item.id, index)}
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
          <Pagination
            onChange={PaginationChange}
            total={Math.ceil(users.totalRow / 10)}
            current={current}
            pageSize={1}
            className="pagination1"
          />
          <UserForm
            onShow={show}
            handleShow={handleShow}
            onUpdateUser={updateUser}
          />
        </Container>
      </div>
      {/* <div>
        <Container>
          <h2 className="tieuDeDS">Danh sách người dùng</h2>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên người dùng và nhấn Enter..."
              name="inputValue"
              onKeyDown={handleInput}
            />
            <div className="input-group-append">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/admin/add-user")}
              >
                Thêm người dùng mới
              </Button>{" "}
            </div>
          </div>
          <div className="table-responsive">
            <div className="table mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>SĐT</th>
                  <th>Loại người dùng</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.data?.map((item, index) => {
                  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
                  return (
                    <tr key={index}>
                      <th>{index + 1 + (current - 1) * 10}</th>
                      <td>{item.id}</td>
                      <td>
                        <img
                          className="hinhAnh"
                          src={item.avatar}
                          alt={item.id}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.gender ? "Nam" : "Nữ"}</td>
                      <td>{regex.test(item.birthday) ? item.birthday : ""}</td>
                      <td>{item.phone}</td>
                      <td>
                        {item.role === "ADMIN" ? "Quản trị" : "Khách hàng"}
                      </td>
                      <td>
                        <button
                          className="btn text-secondary me-1 border-warning"
                          onClick={() => handleUpdateUser(index)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn text-danger border-success"
                          onClick={() => handleDeleteUser(item.id, index)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <Pagination
                onChange={PaginationChange}
                total={Math.ceil(users.totalRow / 10)}
                current={current}
                pageSize={1}
                className="pagination1"
              />
              <UserForm
                onShow={show}
                handleShow={handleShow}
                onUpdateUser={updateUser}
              />
            </div>
          </div>
        </Container>
      </div> */}
    </>
  );
}

export default AdminUserList;
