import axiosClient from "./axiosClient";

//Lấy danh sách Booking
export const apiGetBookingList = async () => {
  const { data } = await axiosClient.get("/dat-phong");
  return data;
};

//Lấy danh sách Booking theo id người dùng
export const apiGetBookingListUserId = async (userId) => {
  const { data } = await axiosClient.get(
    `/dat-phong/lay-theo-nguoi-dung/${userId}`
  );
  return data;
};

//Lấy danh sách Booking theo id booking
export const apiGetBookingListBookingId = async (bookingId) => {
  const { data } = await axiosClient.get(`/dat-phong/${bookingId}`);
  return data;
};

//Thêm bôking
export const apiCreateBooking = async (booking) => {
  const { data } = await axiosClient.post("/dat-phong", booking);
  return data;
};

//Xóa Booking
export const apiDeleteBooking = async (bookingId) => {
  const { data } = await axiosClient.delete(`/dat-phong/${bookingId}`);
  return data;
};

//update booking
export const apiUpdateBooking = async (value) => {
  const { data } = await axiosClient.put(`/dat-phong/${value.id}`, value);
  return data;
};
