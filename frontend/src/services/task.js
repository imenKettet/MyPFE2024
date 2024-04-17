import http from "../utils/http";

const getall = async () => {
  return await http.get("/task");
};

const getOne = async (id) => {
  return await http.get(`/task/${id}`);
};

const getMyTasks = async (id) => {
  return await http.get(`/task/my-tasks/${id}`);
};

const updateOne = async (id, data) => {
  return await http.put(`/task/${id}`, data);
};

const fillTask = async (id, data) => {
  return await http.put(`/task/fill-task/${id}`, data);
};

const deleteOne = async (id) => {
  return await http.delete(`/task/${id}`);
};

const addOne = async (data) => {
  return await http.post("/task", data);
};

export const taskService = {
  getall,
  getOne,
  updateOne,
  fillTask,
  deleteOne,
  addOne,
  getMyTasks
};
