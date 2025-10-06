import client from "../HHTP/client";

export default class PhotoProvider {
  // client
  static async uploadImg(body) {
    return await client.post("/api/v1/photos/save", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async getPhotoByColorId() {
    return await client.get(`/api/v1/color/get-all`);
}
}
