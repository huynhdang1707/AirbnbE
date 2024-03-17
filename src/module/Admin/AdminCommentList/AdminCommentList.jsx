import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { Container } from "react-bootstrap";
import { apiDeleteComment } from "../../../apis/commentManagementAPI";
import { getCommentList } from "../../../slices/commentListSlice";
import { commentUpdated } from "../../../slices/updateCommentSlice";
import "./AdminCommentList.scss";
import CommentForm from "../../CommentForm/CommentForm";
import { apiGetCommentListRoomId } from "../../../apis/commentManagementAPI";

function AdminCommentList() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const [commentList, setCommentList] = useState(null);
  const [del, setDel] = useState(false);
  const [delCmt, setDelCmt] = useState(null);
  const deleteComment = useRef(null);
  //Search by name
  const handleInput = (evt) => {
    if (evt?.key == "Enter" || evt?.key == "Tab") {
      setSearchInput(evt?.target?.value);
    }
  };
  const { comments, isLoading, error } = useSelector(
    (state) => state.commentList
  );
  const length = comments.filter(
    (obj) => new Date(obj.ngayBinhLuan) <= new Date()
  ).length;
  const { updated } = useSelector((state) => state.updateComment);
  useEffect(() => {
    if (searchInput !== "") {
      const fetch = async () => {
        try {
          const data = await apiGetCommentListRoomId(searchInput);
          const tryyy = data.content.filter(
            (obj) => new Date(obj.ngayBinhLuan) <= new Date()
          );
          setCommentList(tryyy);
        } catch (error) {
          console.log(error);
        }
      };
      fetch();
    } else {
      const fetch = async () => {
        const data = await dispatch(getCommentList());
        const tryyy = data.payload.filter(
          (obj) => new Date(obj.ngayBinhLuan) <= new Date()
        );
        setCommentList(tryyy);
      };
      fetch();
    }
  }, [searchInput]);
  useEffect(() => {
    const fetch = async () => {
      const data = await dispatch(getCommentList());
      const tryyy = data.payload.filter(
        (obj) => new Date(obj.ngayBinhLuan) <= new Date()
      );
      setCommentList(tryyy);
    };
    fetch();
  }, [updated, del]);
  const [updateComment, setUpdateComment] = useState();
  const handleUpdateComment = (index) => {
    setUpdateComment(commentList[index]);
    setShow(true);
    dispatch(commentUpdated(false));
  };
  const handleDeleteComment = async (commentId, index) => {
    await swal({
      title: "Bạn có muốn xóa bình luận?",
      text: "Nhấn Ok để tiếp tục!",
      icon: "warning",
      buttons: true,
    }).then((willSuccess) => {
      if (willSuccess) {
        const fetch = async () => {
          try {
            const data = await apiDeleteComment(commentId);
            setDelCmt(data);
          } catch (error) {
            console.log(error);
          }
        };
        fetch();
      }
    });
  };
  useEffect(() => {
    if (delCmt) {
      swal({
        title: `Xóa booking thành công`,
        text: "Nhấn Ok để tiếp tục!",
        icon: "success",
      }).then((willSuccess) => {
        
      });
    }
    setDel(!del);
    setDelCmt(null);
  }, [delCmt]);
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
          <h2 className="tieuDeBL">Danh sách bình luận</h2>
          <div className="d-flex justify-content-center">
            <div className="w-75">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Nhập mã phòng và Enter"
                name="inputValue"
                onKeyDown={handleInput}
              />
            </div>
          </div>
          <div className="body">
            <div className="container">
              <div className="row">
                <div className="table-responsive">
                  <div className="scrollable-table">
                    {commentList?.length === length ? (
                      <table className="table tablecmt">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Mã phòng</th>
                            <th>Mã người dùng</th>
                            <th>Ngày bình luận</th>
                            <th>Nội dung</th>
                            <th>Số sao bình luận</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentList?.map((item, index) => {
                            const ngay = new Date(item.ngayBinhLuan);
                            return (
                              <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{item.id}</td>
                                <td>{item.maPhong}</td>
                                <td>{item.maNguoiBinhLuan}</td>
                                <td>{`${
                                  ngay.getDate() < 10
                                    ? "0" + ngay.getDate()
                                    : ngay.getDate()
                                }/${
                                  ngay.getMonth() + 1 < 10
                                    ? "0" + (ngay.getMonth() + 1)
                                    : ngay.getMonth() + 1
                                }/${ngay.getFullYear()}`}</td>
                                <td>{item.noiDung}</td>
                                <td>{item.saoBinhLuan}</td>
                                <td>
                                  <button
                                    className="btn text-secondary me-1 border-warning mt-1"
                                    onClick={() => handleUpdateComment(index)}
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </button>
                                  <button
                                    className="btn text-danger border-success mt-1"
                                    onClick={() =>
                                      handleDeleteComment(item.id, index)
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
                    ) : (
                      <table className="table tablecmt">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Tên người dùng</th>
                            <th>Avatar</th>
                            <th>Ngày bình luận</th>
                            <th>Nội dung</th>
                            <th>Số sao bình luận</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentList?.map((item, index) => {
                            const ngay = new Date(item.ngayBinhLuan);
                            return (
                              <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{item.tenNguoiBinhLuan}</td>
                                <td>
                                  <img
                                    src={item.avatar}
                                    alt={item.tenNguoiBinhLuan}
                                    style={{ width: "30px", height: "30px" }}
                                  />
                                </td>
                                <td>{`${
                                  ngay.getDate() < 10
                                    ? "0" + ngay.getDate()
                                    : ngay.getDate()
                                }/${
                                  ngay.getMonth() + 1 < 10
                                    ? "0" + (ngay.getMonth() + 1)
                                    : ngay.getMonth() + 1
                                }/${ngay.getFullYear()}`}</td>
                                <td>{item.noiDung}</td>
                                <td>{item.saoBinhLuan}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CommentForm
            onShow={show}
            handleShow={handleShow}
            onUpdateComment={updateComment}
          />
        </Container>
      </div>
    </>
  );
}

export default AdminCommentList;
