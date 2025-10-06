import client from "../HHTP/client";

export default class UserProvider {
  static async getAllUsers(is_blocked, page, phone_number, full_name, listings_count, address ) {
    return await client.get(`/api/admin/users/?is_blocked=${is_blocked}&page=${page}&phone_number=${phone_number}&full_name=${full_name}&listings_count=${listings_count}&address=${address}`);
  }
  static async getOneUser(id) {
    return await client.get(`/api/admin/users/${id}/`);
  }
  static async createUser(body) {
    return await client.post(`/api/admin/users/`, body);
  }
  static async deteleUser(id) {
    return await client.delete(`/api/admin/users/${id}/`);
  }
  static async blockUser(id, body) {
    return await client.post(`/api/admin/users/${id}/block/`, body);
  }
  static async unblockUser(id) {
    return await client.post(`/api/admin/users/${id}/unblock/`);
  }

  static async updateUser(id, body) {
    return await client.put(`/api/admin/users/${id}/`, body);
  }
}
