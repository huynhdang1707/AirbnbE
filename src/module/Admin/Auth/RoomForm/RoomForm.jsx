import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { roomUpdated, updateRoom } from "../../slices/updateRoomSlice";
import style from "./RoomForm.module.scss";
import UploadImage from "../UploadImgage/UploadImage";

const schema = yup.object().shape({
  tenPhong: yup.string().required("(*)Tên phòng không được để trống"),
  khach: yup.number().nullable().required("(*)Lượng khách không được để trống").typeError("(*)Lượng khách phải là một số").min(0, "(*)Lượng khách phải là số lớn hơn hoặc bằng 0"),
  phongNgu:  yup.number().nullable().required("(*)Phòng ngủ không được để trống").typeError("(*)Phòng ngủ phải là một số").min(0, "(*)Phòng ngủ phải là số lớn hơn hoặc bằng 0"),
  giuong:  yup.number().nullable().required("(*)Số giường không được để trống").typeError("(*)Số giường phải là một số").min(0, "(*)Số giường phải là số lớn hơn hoặc bằng 0"),
  phongTam: yup.number().nullable().required("(*)Phòng tắm không được để trống").typeError("(*)Phòng tắm phải là một số").min(0, "(*)Phòng tắm phải là số lớn hơn hoặc bằng 0"),
  moTa: yup.string().required("(*)Mô tả không được để trống"),
  giaTien: yup.number().nullable().required("(*)Giá tiền không được để trống").typeError("(*)Giá tiền phải là một số").min(0, "(*)Giá tiền phải là số lớn hơn hoặc bằng 0"),
  mayGiat: yup.boolean().nullable().required("(*)Máy giặt không được để trống"),
  banLa:yup.boolean().nullable().required("(*)Bàn là không được để trống"),
  tivi:yup.boolean().nullable().required("(*)Tivi không được để trống"),
  dieuHoa:yup.boolean().nullable().required("(*)Điều không được để trống"),
  wifi: yup.boolean().nullable().required("(*)Wifi không được để trống"),
  bep: yup.boolean().nullable().required("(*)Bếp không được để trống"),
  doXe: yup.boolean().nullable().required("(*)Đỗ xe không được để trống"),
  hoBoi:yup.boolean().nullable().required("(*)Hồ bơi không được để trống"),
  banUi: yup.boolean().nullable().required("(*)Bàn ủi không được để trống"),
  maViTri:yup.number().nullable().required("(*)Mã vị trí không được để trống").typeError("(*)Mã vị trí phải là một số").min(0, "(*)Mã vị trí phải là số lớn hơn hoặc bằng 0"),
  hinhAnh: yup.string(),
});
function RoomForm({ onShow, handleShow, onUpdateRoom, onHandleUploaded }) {
  const dispatch = useDispatch();
  //upload
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(null);
  const [id2, setId2] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUp, setImageUp] = useState(null);
  const handleUpload = (id, img, kw) => {
    setShow(true);
    setId2(id);
    setImage(img);
    setKey(kw);
  };

  const handleShow2 = (value) => {
    setShow(value);
  };
  //

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: 0,
      tenPhong: "",
      khach: null,
      phongNgu: null,
      giuong: null,
      phongTam: null,
      moTa: "",
      giaTien: null,
      mayGiat: null,
      banLa: null,
      tivi: null,
      dieuHoa: null,
      wifi: null,
      bep: null,
      doXe: null,
      hoBoi: null,
      banUi: null,
      maViTri: null,
      hinhAnh: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const handleUploaded = (hinhAnh) => {
    setImageUp(hinhAnh);
    setValue("hinhAnh", hinhAnh);
  };
  const { updated, room, error, isLoading } = useSelector(
    (state) => state.updateRoom
  );
  const onSubmit = async (value) => {
    const data = await dispatch(updateRoom(value));

    if (data?.payload?.statusCode === 200) {
      swal({
        title: `Cập nhật phòng thuê thành công`,
        text: "Nhấn Ok để tiếp tục!",
        icon: "success",
      }).then((willSuccess) => {
        if (willSuccess) {
          handleShow(!onShow);
          onHandleUploaded(data?.payload?.content?.hinhAnh);
        }
      });
    }
    dispatch(roomUpdated(data));
  };
  const onErr = (error) => {
    console.log(error);
  };
  useEffect(() => {
    if (onUpdateRoom) {
      if (updated) {
        reset({
          id: room?.id,
          tenPhong: room?.tenPhong,
          khach: room?.khach,
          phongNgu: room?.phongNgu,
          giuong: room?.giuong,
          phongTam: room?.phongTam,
          moTa: room?.moTa,
          giaTien: room?.giaTien,
          mayGiat: room?.mayGiat,
          banLa: room?.banLa,
          tivi: room?.tivi,
          dieuHoa: room?.dieuHoa,
          wifi: room?.wifi,
          bep: room?.bep,
          doXe: room?.doXe,
          hoBoi: room?.hoBoi,
          banUi: room?.banUi,
          maViTri: room?.maViTri,
          hinhAnh: imageUp ? imageUp : room?.hinhAnh,
        });
      } else {
        reset({
          id: onUpdateRoom?.id,
          tenPhong: onUpdateRoom?.tenPhong,
          khach: onUpdateRoom?.khach,
          phongNgu: onUpdateRoom?.phongNgu,
          giuong: onUpdateRoom?.giuong,
          phongTam: onUpdateRoom?.phongTam,
          moTa: onUpdateRoom?.moTa,
          giaTien: onUpdateRoom?.giaTien,
          mayGiat: onUpdateRoom?.mayGiat,
          banLa: onUpdateRoom?.banLa,
          tivi: onUpdateRoom?.tivi,
          dieuHoa: onUpdateRoom?.dieuHoa,
          wifi: onUpdateRoom?.wifi,
          bep: onUpdateRoom?.bep,
          doXe: onUpdateRoom?.doXe,
          hoBoi: onUpdateRoom?.hoBoi,
          banUi: onUpdateRoom?.banUi,
          maViTri: onUpdateRoom?.maViTri,
          hinhAnh:
            getValues("hinhAnh") !== ""
              ? getValues("hinhAnh") !== onUpdateRoom?.hinhAnh && !imageUp
                ? onUpdateRoom?.hinhAnh
                : getValues("hinhAnh")
              : onUpdateRoom?.hinhAnh,
        });
      }
    }
  }, [onUpdateRoom, imageUp]);

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
      {show ? null : (
        <Modal
          show={onShow}
          onHide={() => handleShow(!onShow)}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ display: show ? `none` : `block` }}
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
                <span className="input-group-text">Tên phòng</span>
                <input
                  className="form-control"
                  placeholder="Tên phòng"
                  {...register("tenPhong")}
                />
              </div>
              {errors.tenPhong && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.tenPhong.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Mô tả</span>
                <textarea
                  className="form-control"
                  rows="3"
                  {...register("moTa")}
                  placeholder="Mô tả"
                >
                  {getValues("moTa")}
                </textarea>
              </div>
              {errors.moTa && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.moTa.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Giá tiền</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Giá tiền"
                  {...register("giaTien")}
                />
              </div>
              {errors.giaTien && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.giaTien.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Khách</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Khách"
                  {...register("khach")}
                />
              </div>
              {errors.khach && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.khach.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Phòng ngủ</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phòng ngủ"
                  {...register("phongNgu")}
                />
              </div>
              {errors.phongNgu && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.phongNgu.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Giường</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Giường"
                  {...register("giuong")}
                />
              </div>
              {errors.giuong && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.giuong.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Phòng tắm</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phòng tắm"
                  {...register("phongTam")}
                />
              </div>
              {errors.phongTam && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.phongTam.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Máy giặt</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Máy giặt"
                  {...register("mayGiat")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.mayGiat && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.mayGiat.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Bàn là</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Bàn là"
                  {...register("banLa")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.banLa && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.banLa.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Tivi</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Tivi"
                  {...register("tivi")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.tivi && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.tivi.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Điều hòa</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Điều hòa"
                  {...register("dieuHoa")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.dieuHoa && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.dieuHoa.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Wifi</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Wifi"
                  {...register("wifi")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.wifi && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.wifi.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Bếp</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Bếp"
                  {...register("bep")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.bep && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.bep.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Đỗ xe</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Đỗ xe"
                  {...register("doXe")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.doXe && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.doXe.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Hồ bơi</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Hồ bơi"
                  {...register("hoBoi")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.hoBoi && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.hoBoi.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Bàn ủi</span>
                <select
                  type="text"
                  className="form-control"
                  placeholder="Bàn ủi"
                  {...register("banUi")}
                >
                  <option value={true}>Có</option>
                  <option value={false}>Không</option>
                </select>
              </div>
              {errors.banUi && (
                <p className="fs-7 text-danger fst-italic">
                  {errors.banUi.message}
                </p>
              )}

              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Mã vị trí</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mã vị trí"
                  {...register("maViTri")}
                />
              </div>
              {errors.maVitri && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.maVitri.message}
                </p>
              )}
              <div className={`input-group ${style.input}`}>
                <span className="input-group-text">Hình ảnh</span>
                <img
                  style={{ maxWidth: "100px" }}
                  src={imageUp ? imageUp : watch("hinhAnh")}
                  alt=""
                />
                <input
                  value={imageUp ? imageUp : watch("hinhAnh")}
                  type="text"
                  className="form-control"
                  placeholder="Hình ảnh"
                  {...register("hinhAnh")}
                />
              </div>
              {errors.hinhAnh && (
                <p className="ms-3 fs-7 text-danger fst-italic">
                  {errors.hinhAnh.message}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                className={style.btn2}
                onClick={() =>
                  handleUpload(getValues("id"), getValues("hinhAnh"), "room")
                }
                type="button"
              >
                Upload ảnh
              </button>
              <button type="submit" className={` ${style.btn}`}>
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
      )}

      <UploadImage
        handleUploaded={handleUploaded}
        onShoww={show}
        handleShow={handleShow2}
        onId={id2}
        onImg={image}
        onKey={key}
      />
    </>
  );
}

export default RoomForm;
