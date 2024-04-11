import http from "../utils/http";

const getall = async () => {
  return await http.get("/project");
};

const getOne = async (id) => {
  return await http.get(`/project/${id}`);
};

const updateOne = async (id, data) => {
  return await http.put(`/project/${id}`, data);
};

const deleteOne = async (id) => {
  return await http.delete(`/project/${id}`);
};

const addOne = async (data) => {
  return await http.post("/project", data);
};
const affectProjectToTeam = async (data) => {
  console.log(data);
  return await http.post("/project/affect", data);
};
export const projectService = {
  getall,
  getOne,
  updateOne,
  deleteOne,
  addOne,
  affectProjectToTeam,
};
