import React, { useEffect, useState, useRef } from "react";
import Pagination from "rc-pagination";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { getDescListPage } from "../../../slices/descListPageSlice";
import { apiDeleteDesc } from "../../../apis/descManagementAPI";
import { descUpdated } from "../../../slices/updateDescSlice";
import DescForm from "../../DescForm/DescForm";
import "./AdminDescList.scss";

function AdminDescList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(1);
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const deleteDesc = useRef(null);
  //Search by name
  const handleInput = (evt) => {
    if (evt?.key == "Enter" || evt?.key == "Tab") {
      setSearchInput(evt?.target?.value);
    }
  };
  const { descs, isLoading, error } = useSelector(
    (state) => state.descListPage
  );
  const { updated } = useSelector((state) => state.updateDesc);
  useEffect(() => {
    dispatch(
      getDescListPage({
        pageIndex: current,
        pageSize: 10,
        keyword: searchInput ? searchInput : null,
      })
    );
  }, [current, updated, searchInput, deleteDesc]);
  const [updateDesc, setUpdateDesc] = useState();
  const handleUpdateDesc = (index) => {
    setUpdateDesc(descs?.data[index]);
    setShow(true);
    dispatch(descUpdated(false));
  };
  const handleDeleteDesc = async (descId, index) => {
    await swal({
      title: "Bạn có muốn xóa vị trí?",
      text: "Nhấn Ok để tiếp tục!",
      icon: "warning",
      buttons: true,
    }).then((willSuccess) => {
      if (willSuccess) {
        try {
          const data = apiDeleteDesc(descId);
          deleteDesc.current = data;
          index === 0 && descs?.totalRow % 10 === 1
            ? setCurrent(current - 1)
            : setCurrent(current);
        } catch (error) {
          console.log(error);
        }
        swal({
          title: `Xóa vị trí thành công`,
          text: "Nhấn Ok để tiếp tục!",
          icon: "success",
        }).then((willSuccess) => {
          dispatch(
            getDescListPage({
              pageIndex: current,
              pageSize: 10,
            })
          );
          deleteDesc.current = null;
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
  console.log(descs);
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
          <h2 className="tieuDeVT">Danh sách vị trí</h2>
          <div>
            <div className="d-flex flex-column flex-md-row align-items-md-center mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên vị trí và nhấn Enter..."
                name="inputValue"
                onKeyDown={handleInput}
              />
              <div className="input-group-append">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/admin/add-desc")}
                >
                  Thêm vị trí mới
                </Button>{" "}
              </div>
            </div>
          </div>
          <div className="body">
            <div className="container">
              <div className="row ">
                <div className="table-responsive">
                  <table className="table tabledesc">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên vị trí</th>
                        <th>Tỉnh thành</th>
                        <th>Quốc gia</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {descs?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th>{index + 1 + (current - 1) * 10}</th>
                            <td>{item.id}</td>
                            <td>
                              <img
                                src={item.hinhAnh}
                                alt={item.id}
                                className="hinhAnh"
                              />
                            </td>
                            <td>{item.tenViTri}</td>
                            <td>{item.tinhThanh}</td>
                            <td>{item.quocGia}</td>
                            <td>
                              <button
                                className="btn text-secondary me-1 border-warning mt-1"
                                onClick={() => handleUpdateDesc(index)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn text-danger border-success mt-1"
                                onClick={() => handleDeleteDesc(item.id, index)}
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

                <Pagination
                  onChange={PaginationChange}
                  total={Math.ceil(descs.totalRow / 10)}
                  current={current}
                  pageSize={1}
                  className="pagination2"
                />
              </div>
            </div>
          </div>
          <DescForm
            onShow={show}
            handleShow={handleShow}
            onUpdateDesc={updateDesc}
          />
        </Container>
      </div>
    </>
  );
}

export default AdminDescList;
