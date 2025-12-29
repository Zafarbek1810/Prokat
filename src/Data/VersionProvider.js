import client from "../HHTP/client";

export default class VersionProvider {
    static async getVersionApp(platform) {
        return await client.get(`/api/versioning/app-version1/?platform=${platform}/`);
    }
    static async updateVersionApp(platform, body) {
        return await client.put(`api/versioning/versions/update/${platform}/`, body);
    }

}
