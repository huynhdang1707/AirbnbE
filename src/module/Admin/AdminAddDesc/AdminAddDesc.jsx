import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { adminCreateDesc } from "../../../slices/adminCreateDesc";
import "./AdminAddDesc.scss";

const schema = yup.object({
  tenViTri: yup.string().required("(*)Tên vị trí không được để trống"),
  tinhThanh: yup.string().required("(*)Tỉnh thành không được để trống"),
  quocGia: yup.string().required("(*)Quốc gia không được để trống"),
  hinhAnh: yup.string(),
});

function AdminAddDesc() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: 0,
      tenViTri: "",
      tinhThanh: "",
      quocGia: "",
      hinhAnh: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const { desc, isLoading, error } = useSelector((state) => state.createDesc);
  const [addDesc, setAddDesc] = useState(null);
  const onSubmit = async (value) => {
    const data = await dispatch(adminCreateDesc(value));
    setAddDesc(data);
  };
  const onError = (errors) => {
    console.log(errors);
  };
  if (addDesc?.payload?.statusCode === 201) {
    swal({
      title: "Thêm vị trí mới thành công",
      text: "Nhấn Ok để tiếp tục!",
      icon: "success",
    }).then((willSuccess) => {
      if (willSuccess) {
        navigate("/admin/desc-list");
      }
    });
  }
  if (isLoading)
    return (
      <div className="h-100vh d-flex justify-content-center align-items-center">
        <img src="img/loading.gif" alt="" />
      </div>
    );
  return (
    <>
      <div>
        <Container>
          <h2 className="tieuDeVT">Thêm vị trí</h2>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit, onError)}>
                  <div>
                    <input
                      type="text"
                      className="w-100 form-control"
                      {...register("tenViTri")}
                      placeholder="Vị trí"
                    />
                    {errors.tenViTri && (
                      <p className="ms-3 fs-7 text-danger fst-italic">
                        {errors.tenViTri.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="w-100 form-control"
                      {...register("tinhThanh")}
                      placeholder="Tỉnh thành"
                    />
                    {errors.tinhThanh && (
                      <p className="ms-3 fs-7 text-danger fst-italic">
                        {errors.tinhThanh.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="w-100 form-control"
                      {...register("quocGia")}
                      placeholder="Quốc gia"
                    />
                    {errors.quocGia && (
                      <p className="ms-3 fs-7 text-danger fst-italic">
                        {errors.quocGia.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      placeholder="Hình ảnh (URL)"
                      type="text"
                      className="w-100 form-control"
                      {...register("hinhAnh")}
                    />
                    {errors.hinhAnh && (
                      <p className="ms-3 fs-7 text-danger fst-italic">
                        {errors.hinhAnh.message}
                      </p>
                    )}
                  </div>
                  <div className="text-end lamMoi">
                    <button className="addVT" disabled={isLoading ? true : false}>
                      Thêm vị trí
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

export default AdminAddDesc;
