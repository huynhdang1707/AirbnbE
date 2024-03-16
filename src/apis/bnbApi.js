import axiosClient from "./AxiosClient";

export const apiPhongThue = async (id) => {
  const { data } = await axiosClient.get("/phong-thue", {
    params: {
      id: id,
    },
  });
  return data;
};

export const apiPhongID = async (id) => {
  const { data } = await axiosClient.get(`/phong-thue/${id}`);
  return data.content;
};

export const apiViTri = async (vitri) => {
  const { data } = await axiosClient.get("/vi-tri", {
    params: {
      vitri: vitri,
    },
  });
  return data;
};
