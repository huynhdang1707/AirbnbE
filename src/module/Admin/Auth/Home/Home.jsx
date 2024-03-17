import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiPhongThue } from "../../apis/bnbApi";
import { apiViTri } from "../../apis/bnbApi";
import Card from "react-bootstrap/Card";
import ReactPaginate from "react-paginate";
import { Container, Row, Col } from "react-bootstrap";
import "./Home.scss";
import { current } from "@reduxjs/toolkit";

function Home() {
  const [phongThue, setPhongThue] = useState([]);
  const [viTri, setViTri] = useState([]);
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedQuocGia, setSelectedQuocGia] = useState("");
  const [selectedTinhThanh, setSelectedTinhThanh] = useState("");
  const [selectedViTri, setSelectedViTri] = useState("");
  const itemsPerPage = 20;
  const navigate = useNavigate();

  const getPhongThue = async () => {
    try {
      setIsLoading(true);
      const data = await apiPhongThue();
      setPhongThue(data.content);
    } catch (error) {
      console.log(error);
      setErr(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPhongThue();
  }, []);

  const getViTri = async () => {
    try {
      setIsLoading(true);
      const data = await apiViTri();
      setViTri(data.content);
    } catch (error) {
      console.log(error);
      setErr(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getViTri();
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

 

  const handleQuocGiaChange = (event) => {
    const newQuocGia = event.target.value;
    if (newQuocGia !== selectedQuocGia) {
      setSelectedQuocGia(newQuocGia);
      setSelectedTinhThanh(""); // Reset tỉnh thành khi chọn lại quốc gia
      setSelectedViTri(""); // Reset vị trí khi chọn lại quốc gia
      setCurrentPage(0); // Đặt lại trang hiện tại về 0
    }
  };
  
  const handleTinhThanhChange = (event) => {
    const newTinhThanh = event.target.value;
    if (newTinhThanh !== selectedTinhThanh) {
      setSelectedTinhThanh(newTinhThanh);
      setSelectedViTri(""); // Reset vị trí khi chọn lại tỉnh thành
      setCurrentPage(0); // Đặt lại trang hiện tại về 0
    }
  };
  
  const handleViTriChange = (event) => {
    const newViTri = event.target.value;
    if (newViTri !== selectedViTri) {
      setSelectedViTri(newViTri);
      setCurrentPage(0); // Đặt lại trang hiện tại về 0
    }
  };
  

  const filteredPhongThue = phongThue.filter((item) => {
    const matchingViTri = viTri.find((viTriItem) => viTriItem.id === item.maViTri);
    return (
      (!selectedQuocGia || (matchingViTri && matchingViTri.quocGia && matchingViTri.quocGia.trim() === selectedQuocGia)) &&
      (!selectedTinhThanh || (matchingViTri && matchingViTri.tinhThanh && matchingViTri.tinhThanh.trim() === selectedTinhThanh)) &&
      (!selectedViTri || (matchingViTri && matchingViTri.tenViTri && matchingViTri.tenViTri.trim() === selectedViTri))
    );
  });

  const pageCount = Math.ceil(filteredPhongThue.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredPhongThue.slice(offset, offset + itemsPerPage);

  const uniqueQuocGia = Array.from(new Set(viTri.map((item) => item.quocGia.trim())));
  const uniqueTinhThanh = Array.from(new Set(viTri.map((item) => item.tinhThanh.trim())));
  const uniqueTenViTri = Array.from(new Set(viTri.map((item) => item.tenViTri.trim())));


  const displayData = currentPageData
    .map((item, index) => {
      const matchingViTri = viTri.find((viTriItem) => viTriItem.id === item.maViTri);

      if (isLoading) {
        return (
          <div className="h-100vh d-flex justify-content-center align-items-center">
            <img src="img/loading.gif" alt="" />
          </div>
        );
      }

      return (
        <Col className="my-2" key={index} sm={6} md={4} lg={3}>
          <Card
            className="hienThi"
            onClick={() => navigate(`/phong-thue/${item.id}`)}
          >
            <div>
              <Card.Img variant="top" className="hinhAnh" src={item.hinhAnh} alt={item.tenPhong} />
            </div>
            <Card.Body className="text-white mt-2 p-0">
              <a className="text-start">
                <Card.Title className="tenPhong">
                  {matchingViTri
                    ? `${matchingViTri.tenViTri}, ${matchingViTri.tinhThanh}, ${matchingViTri.quocGia}`
                    : "Unknown Location"}
                </Card.Title>
                <Card.Text className="mt-1 fs-7 text-muted">
                  <p>{item.moTa.length > 60 ? item.moTa.slice(0, 60) + " ..." : item.moTa}</p>
                  <h5 className="giaTien">{item.giaTien}.000.000đ</h5>
                </Card.Text>
              </a>
              <div className=""></div>
            </Card.Body>
          </Card>
        </Col>
      );
    });

  if (err) return null;

  return (
    <Container>
      <div className="d-flex justify-content-center search mt-3">
      <div>
        <select className="form-select chonQuocGia" value={selectedQuocGia} onChange={handleQuocGiaChange}>
          <option value="">Chọn quốc gia</option>
          {uniqueQuocGia.map((quocGia, index) => {
            return (
              <option key={index} value={quocGia}>
                {quocGia}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <select className="form-select chonTinhThanh" value={selectedTinhThanh} onChange={handleTinhThanhChange} disabled={!selectedQuocGia}>
          <option value="">Chọn tỉnh thành</option>
          {uniqueTinhThanh
            .filter((tinhThanh) => {
              // Lọc các tỉnh thành dựa trên quốc gia đã chọn
              if (selectedQuocGia === "") {
                return true; // Hiển thị tất cả tỉnh thành nếu chưa chọn quốc gia
              } else {
                const matchingViTri = viTri.find((viTriItem) => viTriItem.tinhThanh.trim() === tinhThanh);
                return matchingViTri && matchingViTri.quocGia.trim() === selectedQuocGia;
              }
            })
            .map((tinhThanh, index) => {
              return (
                <option key={index} value={tinhThanh}>
                  {tinhThanh}
                </option>
              );
            })}
        </select>
      </div>
      <div>
        <select className="form-select chonViTri" value={selectedViTri} onChange={handleViTriChange} disabled={!selectedQuocGia || !selectedTinhThanh}>
          <option value="">Chọn vị trí</option>
          {uniqueTenViTri
            .filter((tenViTri) => {
              // Lọc các vị trí dựa trên quốc gia và tỉnh thành đã chọn
              if (selectedQuocGia === "" || selectedTinhThanh === "") {
                return true; // Hiển thị tất cả vị trí nếu chưa chọn quốc gia hoặc tỉnh thành
              } else {
                const matchingViTri = viTri.find(
                  (viTriItem) => viTriItem.tenViTri.trim() === tenViTri && viTriItem.tinhThanh.trim() === selectedTinhThanh
                );
                return matchingViTri && matchingViTri.quocGia.trim() === selectedQuocGia;
              }
            })
            .map((tenViTri, index) => {
              return (
                <option key={index} value={tenViTri}>
                  {tenViTri}
                </option>
              );
            })}
        </select>
      </div>
      </div>
      <Row className="phongThue mt-4">{displayData}</Row>
      <div className="d-flex justify-content-center my-2 page">
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="mx-2 number"
        />
      </div>
    </Container>
  );
}

export default Home;
