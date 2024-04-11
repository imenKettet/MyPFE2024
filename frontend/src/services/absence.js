import http from "../utils/http";

const getall = async () => {
  return await http.get("/absence");
};

const getOne = async (id) => {
  return await http.get(`/absence/${id}`);
};

const updateOne = async (id, data) => {
  return await http.put(`/absence/${id}`, data);
};

const deleteOne = async (id) => {
  return await http.delete(`/absence/${id}`);
};

const addOne = async (data) => {
  return await http.post("/absence", data);
};

export const absenceService = {
  getall,
  getOne,
  updateOne,
  deleteOne,
  addOne,
};
