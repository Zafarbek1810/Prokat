import client from "../HHTP/client";

export default class ChatProvider {
  static async getAllChats(is_archived, page) {
    return await client.get(`/api/admin/chats/?is_archived=${is_archived}&page=${page}`);
  }
  static async getOneUser(id) {
    return await client.get(`/api/admin/users/${id}/`);
  }
  static async getOneChat(id) {
    return await client.get(`/api/admin/chats/${id}/messages/`);
  }
  static async deleteMessageInChat(id, message_id) {
    return await client.delete(`/api/admin/chats/${id}/messages/${message_id}/`);
  }
  static async deleteChats(id) {
    return await client.delete(`/api/admin/chats/${id}/`);
  }
  static async blockChat(id, body) {
    return await client.post(`/api/admin/chats/${id}/archive/`, body);
  }
  static async deleteMessageInChat(chatId, messageId) {
    return await client.delete(`/api/admin/chats/${chatId}/messages/${messageId}/`);
  }

}
