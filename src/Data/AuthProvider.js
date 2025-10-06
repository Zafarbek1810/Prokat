import client from "../HHTP/client";

class AuthProvider{
  static async login (body){
    return await client.post("/api/admin/login/", body);
  }
  static async getMe (){
    return await client.get("/api/profile/me/");
  }
}

export default AuthProvider;