import http from "../utils/http";

const getall = async () => {
  return await http.get("/user");
};
const getdetails = async () => {
  return await http.get("/user/details");
};
const getOne = async (id) => {
  return await http.get(`/user/${id}`);
};

const updateOne = async (id, data) => {
  return await http.put(`/user/${id}`, data);
};

const deleteOne = async (id) => {
  return await http.delete(`/user/${id}`);
};

const addOne = async (data) => {
  return await http.post("/user", data);
};

export const userService = {
  getall,
  getOne,
  updateOne,
  deleteOne,
  addOne,
  getdetails,
};
