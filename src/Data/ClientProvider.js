import client from "../HHTP/client";

export default class ClientProvider {

    // client
    static async createClient(body) {
        return await client.post("/api/v1/clients/save", body);
    }
    static async getAllClients(page = 0, size = 10, params) {
        return await client.get(`/api/v1/clients/get-all?page=${page}&size=${size}&${params}`);
    }
    static async deteleClients(id) {
        return await client.delete(`/api/v1/clients/delete/${id}`);
    }
    static async getOneClient(id) {
        return await client.get(`/api/v1/clients/get/${id}`);
    }
    static async updateClient(id, body) {
        return await client.put(`api/v1/clients/update/${id}`, body);
    }


}
