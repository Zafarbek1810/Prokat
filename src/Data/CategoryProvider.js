import client from "../HHTP/client";

export default class CategoryProvider {

    // client
    static async createCategory(body) {
        return await client.post("/api/admin/categories/", body);
    }
    static async getAllCategory() {
        return await client.get(`/api/admin/categories/`);
    }
    static async deleteCategory(id) {
        return await client.delete(`/api/admin/categories/${id}/`);
    }
    static async getOneCategory(id) {
        return await client.get(`/api/admin/categories/get/${id}/`);
    }
    static async updateCategory(id, body) {
        return await client.put(`/api/admin/categories/${id}/`, body);
    }


}
