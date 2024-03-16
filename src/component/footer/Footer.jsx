import React from 'react'
import "./Footer.scss"

function Footer() {
  return (
    <div className="footer">
      <div className='container'>
        <div className="row gioiThieu">
          <div className="col-sm-3">
            <section>
              <h3 className='tieuDe'>Hỗ trợ</h3>
              <ul>
                <li className='mt-3'><a href="#" className='noiDung'>Trung tâm trợ giúp</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>AirCover</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Hỗ trợ người khuyết tật</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Các tùy chọn hủy</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Biện pháp ứng phó với đại dịch COVID-19 của chúng tôi</a></li>
                <li className='mt-3 mb-3'><a href="#" className='noiDung'>Báo cáo lo ngại của hàng xóm</a></li>
              </ul>
            </section>
          </div>
          <div className="col-sm-3">
            <section>
              <h3 className='tieuDe congDong'>Cộng đồng</h3>
              <ul>
                <li className='mt-3'><a href="#" className='noiDung'>Airbnb.org: nhà ở cứu trợ</a></li>
                <li className='mt-3 mb-3'><a href="#" className='noiDung'>Chống phân biệt đối xử</a></li>
              </ul>
            </section>
          </div>
          <div className="col-sm-3">
            <section>
              <h3 className='tieuDe tiepKhach'>Đón tiếp khách</h3>
              <ul>
                <li className='mt-3'><a href="#" className='noiDung'>Cho thuê nhà trên Airbnb</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>AirCover cho Chủ nhà</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Xem tài nguyên đón tiếp khách</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Truy cập diễn đàn cộng đồng</a></li>
                <li className='mt-3 mb-3'><a href="#" className='noiDung'>Đón tiếp khách có trách nhiệm</a></li>
              </ul>
            </section>
          </div>
          <div className="col-sm-3">
            <section>
              <h3 className='tieuDe air'>Airbnb</h3>
              <ul>
                <li className='mt-3'><a href="#" className='noiDung'>Trang tin tức</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Tìm hiểu về các tính năng mới</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Thư ngỏ từ các nhà sáng lập</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Cơ hội nghề nghiệp</a></li>
                <li className='mt-3'><a href="#" className='noiDung'>Nhà đầu tư</a></li>
              </ul>
            </section>
          </div>
        </div>
        <div className='row loiDan'>
          <div className='col-sm-6 thongTin'>
            <span>© 2023 Airbnb, Inc.</span>
            <span>
              <ul className='baoMat'>
                <span className='mx-2'>.</span>
                <li className='me-2'><a href="#">Quyền riêng tư</a></li>
                <span>.</span>
                <li className='mx-2'><a href="#">Điều khoản</a></li>
                <span>.</span>
                <li className='mx-2'><a href="#">Sơ đồ trang web</a></li>
              </ul>
            </span>
          </div>
          <div className='col-sm-4 mangXaHoi'>
            <span><a href="#" className='tiengViet'><i className="bi bi-globe mx-2"></i>Tiếng Việt (VN)</a></span>
            <span className='mx-2'>₫</span>
            <span className='tiengViet me-2'>VND</span>
            <span className='mx-2'><a href="https://www.facebook.com/airbnb" target='_blank'><i className="bi bi-facebook icon"></i></a></span>
            <span className='mx-2'><a href="https://twitter.com/airbnb" target='_blank'><i className="bi bi-twitter icon"></i></a></span>
            <span className='mx-2'><a href="https://www.instagram.com/airbnb/" target='_blank'><i className="bi bi-instagram icon"></i></a></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer