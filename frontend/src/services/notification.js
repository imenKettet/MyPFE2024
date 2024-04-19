import http from "../utils/http";


const getAll = async () => {
    return await http.get(`/notification`);
};

const readAllNotifications = async () => {
    return await http.get(`/notification/read`);
};

const readOneNotification = async (id) => {
    return await http.put(`/notification/read/${id}`);
};


export const notificationService = {
    getAll,
    readAllNotifications,
    readOneNotification
};
