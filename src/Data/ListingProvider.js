import client from "../HHTP/client";

export default class ListingProvider {

    // listing
    static async getAllListing(category_id, status, page, query, user_id) {
        return await client.get(`/api/admin/listings/?category_id=${category_id}&status=${status}&page=${page}&query=${query}&user_id=${user_id}`);
    }
    
    static async getAllClients(category_id, status, page) {
        return await client.get(`/api/admin/listings/?category_id=${category_id}&status=${status}&page=${page}`);
    }
    static async deteleListing(id) {
        return await client.delete(`/api/admin/listings/${id}/`);
    }
    static async getOneListing(id) {
        return await client.get(`/api/admin/listings/${id}/`);
    }
    static async updateListing(id, body) {
        return await client.put(`api/listings/update/${id}`, body);
    }
    static async approveListing(id, body) {
        return await client.post(`api/admin/listings/${id}/approve/`, body);
    }
    static async rejectListing(id, body) {
        return await client.post(`api/admin/listings/${id}/reject/`, body);
    }

}
