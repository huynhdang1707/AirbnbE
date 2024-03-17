import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { apiBinhLuan, apiPhongID } from "../../../apis/bnbApi";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import { getInfoUser } from "../../../slices/infoUserSlice";
import "./AirComment.scss";
import Comment from "../Comment/Comment";
import { apiGetCommentListRoomId } from "../../../apis/commentManagementAPI";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userCreateComment } from "../../../slices/userCreateComment";
import swal from "sweetalert";
import { useLocation, useNavigate } from "react-router-dom";

const schema = yup.object({
  noiDung: yup.string(),
  saoBinhLuan: yup.number(),
});

function AirComment({ id }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);
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
      noiDung: "",
      saoBinhLuan: 0,
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const [rating, setRating] = useState(0);
  const [flagRating, setFlagRating] = useState(false);

  const handleMouseOver = (starIndex) => {
    setRating(starIndex);
  };

  const handleMouseOut = () => {
    // Kiểm tra nếu rating là 0, thì không thay đổi giá trị
    if (rating === 0) {
      return;
    }
    setRating(rating);
  };

  const handleRatingClick = (starIndex) => {
    setRating(starIndex);
  };

  const renderStars = () => {
    const maxStars = 5;
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      const starClass = i <= rating ? "bi-star-fill" : "bi-star";

      stars.push(
        <i
          key={i}
          className={`bi ${starClass}`}
          onMouseOver={() => handleMouseOver(i)}
          onMouseOut={handleMouseOut}
          onClick={() => handleRatingClick(i)}
        ></i>
      );
    }

    return stars;
  };
  const [reloadChild, setReloadChild] = useState(false);
  const [addCmt, setAddCmt] = useState(null);
  const [flagAdd, setFlagAdd] = useState(false);
  const [errCmt, setErrCmt] = useState(null);
  const [cmt, setCmt] = useState(null);
  const onSubmit = async () => {
    setCmt(getValues("noiDung"));

    //
    if (!user) {
      swal({
        title: "Bạn chưa đăng nhập!",
        text: "Nhấn Ok để tiếp tục!",
        icon: "warning",
      }).then((willSuccess) => {
        if (willSuccess) {
          navigate(`/signin?redirectUrl=${pathname}`, { replace: true });
        }
      });
    } else {
      if (cmt === "") {
        setErrCmt("(*)Nội dung không được để trống");
      } else {
        if (rating === 0 && !flagRating) {
          swal({
            title: "Thêm đánh giá thất bại",
            text: `Có vẻ bạn chưa đánh giá số sao`,
            icon: "error",
          }).then((willSuccess) => {
            if (willSuccess) {
              setAddCmt(null);
              setFlagRating(true);
            }
          });
        } else {
          setFlagRating(false);
          const value1 = {
            id: 0,
            maPhong: id,
            ngayBinhLuan: new Date(),
            maNguoiBinhLuan: user?.user?.id,
            saoBinhLuan: rating,
            noiDung: getValues("noiDung"),
          };
          const data = await dispatch(userCreateComment(value1));
          setAddCmt(data);
          setReloadChild(!reloadChild);
          setFlagAdd(true);
          setErrCmt(null);
          setValue("noiDung", "");
          setCmt(null);
          setRating(0);
        }
      }
    }
  };
  if (addCmt?.payload?.statusCode === 201 && flagAdd) {
    swal({
      title: "Thêm đánh giá thành công",
      text: "Nhấn Ok để tiếp tục!",
      icon: "success",
    }).then((willSuccess) => {
      if (willSuccess) {
        setAddCmt(null);
        setFlagAdd(false);
      }
    });
  }
  useEffect(() => {}, [reloadChild, cmt]);

  return (
    <div className="batDau">
      <Container cmted={reloadChild}>
        <h2 className="tieuDeNX">ĐÁNH GIÁ PHÒNG</h2>
        <div className="rating-stars">{renderStars()}</div>
        <InputGroup className="mt-2">
          <InputGroup.Text>Nhập đánh giá</InputGroup.Text>
          <Form.Control
            {...register("noiDung")}
            as="textarea"
            aria-label="With textarea"
          />

          <Button
            onClick={onSubmit}
            variant="outline-secondary"
            id="button-addon2"
          >
            Đánh giá
          </Button>
        </InputGroup>
        {errCmt && <p className="ms-3 fs-7 text-danger fst-italic">{errCmt}</p>}
        <div className="mt-3">
          <Row>
            <Col>
              <Comment cmted={reloadChild} roomId={id} />
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default AirComment;
