import { Axios } from "axios";
import axiosClient from "./axiosClient.js";

export const apiSignIn = async (value) => {
  const { data } = await axiosClient.post("/auth/signin", value);
  return data;
};

export const apiSignUp = async (value) => {
  const { data } = await axiosClient.post("/auth/signup", value);
  return data;
};

// lấy thông tin user đầy đủ
export const apiGetInfoUser = async (userId) => {
  const { data } = await axiosClient.get(`/users/${userId}`);
  return data;
};
