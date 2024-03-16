import axiosClient from "./AxiosClient";

//Lấy danh sách comment
export const apiGetCommentList = async () => {
  const { data } = await axiosClient.get("/binh-luan");
  return data;
};

//Lấy danh sách comment theo id phòng
export const apiGetCommentListRoomId = async (roomId) => {
  const { data } = await axiosClient.get(
    `/binh-luan/lay-binh-luan-theo-phong/${roomId}`
  );
  return data;
};

//Thêm comment
export const apiCreateComment = async (comment) => {
  const { data } = await axiosClient.post("/binh-luan", comment);
  return data;
};

//Xóa Comment
export const apiDeleteComment = async (cmtId) => {
  const { data } = await axiosClient.delete(`/binh-luan/${cmtId}`);
  return data;
};

//update booking
export const apiUpdateComment = async (value) => {
  const { data } = await axiosClient.put(`/binh-luan/${value.id}`, value);
  return data;
};
