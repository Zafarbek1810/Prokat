import client from "../HHTP/client";

export default class AdminProvider {

    static async getMe() {
        return await client.get(`/api/getMe`);
    }
    static async statistics() {
        return await client.get(`/api/admin/statistics/`);
    }
    static async getAllAdmins( page, query) {
        return await client.get(`/api/admin/admins/?page=${page}&search=${query}`);
    }
    static async getOneAdmin(id) {
        return await client.get(`/api/admin/admins/${id}/`);
    }
    static async updateAdmin(id, body) {
        return await client.put(`/api/admin/admins/${id}/`, body);
    }
    static async createAdmin(body) {
        return await client.post(`/api/admin/admins/`, body);
    }
    static async deteleAdmin(id) {
        return await client.delete(`/api/admin/admins/${id}/`);
    }

}
