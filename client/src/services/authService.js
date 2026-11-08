import api from "./api";

export const customerSignup = async (formData) => {
  const response = await api.post("/auth/customer/signup", formData);
  return response.data;
};

export const vendorSignup = async (formData) => {
  const response = await api.post("/auth/vendor/signup", formData);
  return response.data;
};

export const login = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};

export const vendorLogin = async (formData) => {
  const response = await api.post("/auth/vendor/login", formData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};