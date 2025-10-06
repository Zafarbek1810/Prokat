import client from "../HHTP/client";

export default class AnalyticProvider {

    static async getSoldProductReports() {
        return await client.get(`/api/v1/analytics/get-sold-product-reports`);
    }
    static async getClientsActivity() {
        return await client.get(`/api/v1/analytics/clients-activity-report`);
    }
    static async getPaymentHistory(page = 0, size = 10) {
        return await client.get(`/api/v1/analytics/get-payment-history?page=${page}&size=${size}`);
    }
}
