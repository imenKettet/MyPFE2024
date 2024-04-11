import http from "../utils/http";

const getall = async () => {
  return await http.get("/team");
};
const getdetails = async () => {
  return await http.get("/team/details");
};

const getOne = async (id) => {
  return await http.get(`/team/${id}`);
};

const updateOne = async (id, data) => {
  return await http.put(`/team/${id}`, data);
};

const deleteOne = async (id) => {
  return await http.delete(`/team/${id}`);
};

const addOne = async (data) => {
  return await http.post("/team", data);
};

export const teamService = {
  getall,
  getOne,
  updateOne,
  deleteOne,
  addOne,
  getdetails,
};
