import client from "../HHTP/client";

export default class BookingProvider {


    static async getAllBookings(status, ordering, payment_type, rental_type, search, page) {
        return await client.get(`/api/admin/bookings/?status=${status}&ordering=${ordering}&payment_type=${payment_type}&rental_type=${rental_type}&search=${search}&page=${page}`);
    }

    static async getOneBooking(id) {
        return await client.get(`/api/admin/bookings/${id}`);
    }


}
