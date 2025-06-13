import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ProfileView = async (data = {}) => {
  const response = await axios.get(`${BASE_URL}/profile/view`, {
    params: data, 
    withCredentials: true,
  });
  return response.data;
};


export const ProfileEdit = async (data) => {
  const response = await axios.patch(`${BASE_URL}/profile/edit`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const ProfileUpload = async (formData) => {
  const response = await axios.put(`${BASE_URL}/profile/edit/upload`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const ProfilePasswordUpdate = async (data) => {
  const response = await axios.patch(`${BASE_URL}/profile/edit/password`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const ProfileDelete = async (data) => {
  const response = await axios.delete(`${BASE_URL}/profile/delete`, {
    data,
    withCredentials: true,
  });
  return response.data;
};
