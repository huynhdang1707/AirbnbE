import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import style from "./UploadImage.module.scss";
import { apiUploadRoomImg } from "../../apis/roomManagementAPI";
import { apiUploadDescImg } from "../../apis/descManagementAPI";
import { apiUploadAva } from "../../apis/userManagementAPI";
import swal from "sweetalert";
const schema = yup.object({
  hinhAnh: yup
    .mixed()
    .test("required", "Vui lòng chọn hình ảnh", (value) => {
      return value && value.length;
    })
    .test("fileSize", "Max size 1mb", (value, context) => {
      return value && value[0] && value[0].size <= 1048576;
    })
    .test("type", "Phải chọn type hình ảnh", function (value) {
      return (
        (value && value[0] && value[0]?.type === "image/jpeg") ||
        value[0]?.type === "image/png"
      );
    }),
  id: yup.number(),
});

function UploadImage({
  onShoww,
  handleShow,
  onId,
  onImg,
  handleUploaded,
  onKey,
}) {
  const [error, setError] = useState(null);
  const [upload, setUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hinhAnh: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const [imgPreview, setImgPreview] = useState("");
  const imageField = watch("hinhAnh");
  useEffect(() => {
    if (!imageField) return;
    // FileReader là một đối tượng trong JS dùng để xử lý file
    const fileReader = new FileReader();
    // readAsDataURL là phương thức dùng để chuyển file thành url để sử dụng trong thuộc tính src của thẻ img
    if (imageField[0]) {
      fileReader.readAsDataURL(imageField[0]);
    }
    // onload là callback để chờ sau khi xử lý xong nhận được kết quả
    fileReader.onload = (evt) => {
      setImgPreview(evt?.target.result);
    };
  }, [imageField]);
  useEffect(() => {
    reset({});
  }, [onImg]);

  const onSubmit = async (value) => {
    const payload = { ...value, id: onId, hinhAnh: value.hinhAnh[0] };
    if (onKey === "room") {
      try {
        const data = await apiUploadRoomImg(payload);
        if (data?.data?.statusCode === 200) {
          swal({
            title: `Cập nhật hình ảnh phòng thuê thành công`,
            text: "Nhấn Ok để tiếp tục!",
            icon: "success",
          }).then((willSuccess) => {
            if (willSuccess) {
              handleShow(!onShoww);
              handleUploaded(data?.data?.content?.hinhAnh);
            }
          });
        }
        setUpload(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    } else if (onKey === "desc") {
      try {
        const data = await apiUploadDescImg(payload);
        if (data?.data?.statusCode === 200) {
          swal({
            title: `Cập nhật hình ảnh vị trí thành công`,
            text: "Nhấn Ok để tiếp tục!",
            icon: "success",
          }).then((willSuccess) => {
            if (willSuccess) {
              handleShow(!onShoww);
              handleUploaded(data?.data?.content?.hinhAnh);
            }
          });
        }
        setUpload(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    } else if (onKey === "user") {
      const payload1 = { ...value, id: onId, avatar: value.hinhAnh[0] };
      try {
        const data = await apiUploadAva(payload1);
        console.log(data);
        if (data?.data?.statusCode === 200) {
          swal({
            title: `Cập nhật avatar người dùng thành công`,
            text: "Nhấn Ok để tiếp tục!",
            icon: "success",
          }).then((willSuccess) => {
            if (willSuccess) {
              handleShow(!onShoww);
              handleUploaded(data?.data?.content?.avatar);
            }
          });
        }
        setUpload(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
  };
  const onErr = (err) => {
    console.log(err);
  };

  if (isLoading)
    return (
      <div className="h-100vh d-flex justify-content-center align-items-center">
        <img src="img/loading.gif" alt="" />
      </div>
    );
  return (
    <Modal
      show={onShoww}
      onHide={() => handleShow(!onShoww)}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header className="bg-pink-primary" closeButton>
        <Modal.Title className="text-header-border-color">
          Cập nhật thông tin
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit, onErr)}>
        <Modal.Body className={style.formBody}>
          <div className="row mb-1 align-items-center">
            <div className="col-2 text-end">Hình ảnh</div>
            <div className="col-10">
              <img
                style={{ maxWidth: "200px" }}
                className="imgPreview"
                src={imgPreview ? imgPreview : onImg}
                alt=""
              />
              <input
                className="ms-2"
                type="file"
                multiple
                placeholder="hinhAnh ..."
                {...register("hinhAnh")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
         {imageField?(imageField[0]?<button type="submit" className={` ${style.btnn}`}>
            Cập nhật
          </button>: null )   : null}
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

export default UploadImage;
