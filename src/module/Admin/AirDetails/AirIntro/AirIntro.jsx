import React, { useState, useEffect } from "react";
import { apiPhongID } from "../../../apis/bnbApi";
import { apiViTri } from "../../../apis/bnbApi";
import "./AirIntro.scss";

function AirIntro({ id }) {
  const [phongThue, setPhongThue] = useState({});
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viTri, setViTri] = useState([]);
  const getPhongThue = async () => {
    try {
      const data = await apiPhongID(id);
      setPhongThue(data);
    } catch (error) {
      console.log(error);
      setErr(err);
    }
  };

  useEffect(() => {
    getPhongThue();
  }, []);

  const getViTri = async () => {
    try {
      const data = await apiViTri();
      setViTri(data.content);
    } catch (error) {
      console.log(error);
      setErr(err);
    }
  };

  useEffect(() => {
    getViTri();
  }, []);

  if (err) return null;
  const matchingViTri = viTri.find(
    (viTriItem) => viTriItem.id === phongThue.maViTri
  );
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
    <div className="container mt-2">
      <span className="tenPhong">
        <i class="bi bi-house me-2"></i>
        {phongThue.tenPhong}
      </span>
      <a href="">
        <h5 className="diaDiem mt-2">
          {matchingViTri
            ? `${matchingViTri.tenViTri}, ${matchingViTri.tinhThanh}, ${matchingViTri.quocGia}`
            : "Unknown Location"}
        </h5>
      </a>
      <img src={phongThue.hinhAnh} className="hinhAnh mt-3" alt="" />
    </div>
  );
}

export default AirIntro;
