import client from "../HHTP/client";

export default class ConditionProvider {

    // client
    static async createCondition(body) {
        return await client.post("/api/admin/conditions/", body);
    }
    static async getAllCondition() {
        return await client.get(`/api/admin/conditions/`);
    }
    static async deleteCondition(id) {
        return await client.delete(`/api/admin/conditions/${id}/`);
    }
    static async getOneCondition(id) {
        return await client.get(`/api/v1/conditions/get/${id}`);
    }
    static async updateCondition(id, body) {
        return await client.put(`/api/admin/conditions/${id}/`, body);
    }


}
