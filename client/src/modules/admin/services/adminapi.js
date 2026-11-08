
import api from "../../../services/api";

// GET ALL VENDORS
export const getVendors = async (params = {}) => {
  const response = await api.get("/vendors", { params });
  return response.data;
};

// GET SINGLE VENDOR
export const getVendorById = async (id) => {
  const response = await api.get(`/vendors/${id}`);
  return response.data;
};

// APPROVE VENDOR
export const approveVendor = async (id) => {
  const response = await api.put(`/vendors/${id}/approve`);
  return response.data;
};

// REJECT VENDOR
export const rejectVendor = async (id) => {
  const response = await api.put(`/vendors/${id}/reject`);
  return response.data;
};

// BLOCK / UNBLOCK VENDOR
export const toggleVendorStatus = async (id) => {
  const response = await api.put(`/vendors/${id}/toggle-status`);
  return response.data;
};



// SOFT DELETE VENDOR
export const deleteVendor = async (id) => {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};
