import axiosClient from "./AxiosClient";

//Lấy danh sách người dùng theo trang
export const apiGetUserListPage = async (value) => {
  const payload = { ...value };
  const { data } = await axiosClient.get("/users/phan-trang-tim-kiem", {
    params: payload,
  });
  return data;
};

//Thêm user
export const apiCreateUser = async (user) => {
  const { data } = await axiosClient.post("/users", user);
  return data;
};

//Xóa user
export const apiDeleteUser = async (userId) => {
  const { data } = await axiosClient.delete("/users", {
    params: {
      id: userId,
    },
  });
  return data;
};

//update user
export const apiUpdateUser = async (value) => {
  const { data } = await axiosClient.put(`/users/${value.id}`, value);
  return data;
};

//upload avatar
export const apiUploadAva = async (value) => {
  let formData = new FormData();
  formData.append("formFile", value.avatar);
  const data = await axiosClient.post("/users/upload-avatar", formData);
  return data;
};
