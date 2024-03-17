import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { getCommentList } from "../../../slices/commentListSlice";
import "./UserCommentList.scss";
import swal from "sweetalert";
import { Navigate, useNavigate } from "react-router-dom";

function UserCommentList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { comments, isLoading, error } = useSelector(
    (state) => state.commentList
  );
  const [commentList, setCommentList] = useState(null);
  const [isL, setIsL] = useState(false);

  useEffect(() => {
    setIsL(true);
    const fetch = async () => {
      const data = await dispatch(getCommentList());
      const xxx = data?.payload?.filter(
        (it) => it?.maNguoiBinhLuan === user?.user?.id
      );
      setCommentList(xxx);
      setIsL(false);
    };
    fetch();
  }, []);
  if (isLoading || isL)
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
          <h2 className="tieuDeBL">Danh sách bình luận của bạn</h2>
          <div className="body">
            <div className="container">
              <div className="row">
               <div className="table-responsive">
               <table className="table tableusercmt">
                  <thead>
                    <tr className="th1">
                      <th scope="col">#</th>
                      <th scope="col">ID</th>
                      <th scope="col">Mã phòng</th>
                      <th scope="col">Ngày bình luận</th>
                      <th scope="col">Nội dung</th>
                      <th scope="col">Số sao đánh giá</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentList?.map((item, index) => {
                      const ngay = new Date(item.ngayBinhLuan);
                      return (
                        <tr key={index} className="th2">
                          <th>{index + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.maPhong}</td>
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
                              className="btn text-danger border-success mt-1"
                              onClick={() =>
                                navigate(`/phong-thue/${item.maPhong}`)
                              }
                            >
                              <i class="bi bi-box-arrow-right"></i>
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
        </Container>
      </div>
    </>
  );
}

export default UserCommentList;
