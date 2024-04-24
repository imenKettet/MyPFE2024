import http from "../utils/http";

const stats = async () => {
    return await http.get(`/dashboard`);
};


export const dashboardService = {
    stats
};
