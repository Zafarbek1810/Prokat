import client from "../HHTP/client";

export default class Shelf_box_Provider {
  static async getShelfBox(orderId) {
    return await client.get(`/api/v1/shelves/get-shelf-number/${orderId}`);
  }
}
