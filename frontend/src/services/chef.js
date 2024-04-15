import http from "../utils/http";

const getOne = async (id) => {
    return await http.get(`/chef/my-team/${id}`);
};

const affectTasks = async (id, data) => {
    return await http.put(`/chef/affect-tasks/${id}`, data);
};


export const chefService = {
    getOne,
    affectTasks,
};
