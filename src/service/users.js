const flightBookingDb = require("../model/users")

//import required modules
// const flightBookingDb = require("../model/users")
const Validators = require("../utilities/validator")

let fBookingService = {}


fBookingService.bookFlight = async (flightBooking) => {
    Validators.validateFlightId(flightBooking.flightId);
    customer_details = await flightBookingDb.checkCustomer(flightBooking.customerId);
    if (customer_details) {
        flight_details = await flightBookingDb.checkAvailability(flightBooking.flightId);
        console.log(flight_details);
        if (!flight_details) {
            error = new Error("Flight Unavailable");
            error.status = 404;
            throw error;
        }
        else if (flight_details.status == 'Cancelled') {
            error = new Error(`Sorry for the Inconvinience... ${flightBooking.flightId} is cancelled!!`);
            error.status = 404;
            throw error;
        }
        else if (flight_details.availableSeats == 0) {
            error = new Error(`Flight ${flightBooking.flightId} is already full!!`);
            error.status = 406;
            throw error;
        }
        else if (flight_details.availableSeats < flightBooking.noOfTickets) {
            error = new Error(`Flight almost Full... Only ${flight_details.availableSeats} left!!`);
            error.status = 406;
            throw error;
        }
        else {
            let booking_cost = flight_details.fare * flightBooking.noOfTickets;
            flightBooking.bookingCost = booking_cost;
            if (customer_details.walletAmount < booking_cost) {
                error = new Error(`Insufficient Wallet Amount. Add more Rs. ${booking_cost - customer_details.walletAmount} to continue booking`);
                error.status = 406;
                throw error;
            }
            else {
                bookflight = await flightBookingDb.bookFlight(flightBooking);
                return bookflight;
            }
        }

    } else {
        error = new Error("Customer not registered. Register to proceed");
        error.status = 404;
        throw error;
    }

}

fBookingService.getAllBookings = async () => {
    all_booking = await flightBookingDb.getAllBookings();
    if (!all_booking) {
        err = new Error("No booking is found in any flight");
        err.status = 404;
        throw err;
    }
    else {
        console.log("In servie", all_booking);
        return all_booking;
    }
}

fBookingService.customerBookingsByFlight = async (customerId, flightId) => {
    console.log('in service');
    let cust_check = await flightBookingDb.checkCustomer(customerId);
    if (!cust_check) {
        err = new Error("Customer not found");
        err.status = 404;
        throw err;
    }
    else {
        flight_check = await flightBookingDb.checkAvailability(flightId);
        if (!flight_check) {
            err = new Error("Flight detail not found");
            err.status = 404;
            throw err;
        }
        else {
            all_booking = await flightBookingDb.customerBookingsByFlight(customerId, flightId);
            if (!all_booking) {
                err = new Error("No booking is found in any flight");
                err.status = 404;
                throw err;
            }
            else {
                console.log("In servie", all_booking);
                return all_booking;
            }
        }
    }


}

fBookingService.getbookingsByFlightId = async (flightId) => {
    let booking = flightBookingDb.getbookingsByFlightId(flightId);
    if (!booking) {
        err = new Error(`No bookings found in ${flightId}`);
        err.status = 404;
        throw err;
    }
    else {
        return booking;
    }

}

fBookingService.updateBooking = async (bookingId, noOfTickets) => {
    let checkbook = await flightBookingDb.checkBooking(bookingId);
    if (!checkbook) {
        err = new Error(`No Bookings with bookingId ${bookingId} `);
        err.status = 404;
        throw err;
    }
    else {

        if (checkbook.status == "Cancelled") {
            err = new Error(`Sorry for the Inconvenience... ${bookingId} has been cancelled!!`);
            err.status = 406;
            throw err;
        }
        else if (checkbook.availableSeats == 0) {
            err = new Error(`Flight is already full. Can't book more tickets`);
            err.status = 406;
            throw err;
        }
        else if (checkbook.availableSeats < noOfTickets) {
            error = new Error(`Flight almost Full... Only ${flight_details.availableSeats} left!!`);
            error.status = 406;
            throw error;
        }
        else {
            let booking_cost = checkbook.fare * noOfTickets;
            customer_details = flightBookingDb.checkCustomer(checkbook.bookings.customerId);
            // flightBooking.bookingCost = booking_cost;
            if (customer_details.walletAmount < booking_cost) {
                error = new Error(`Insufficient Wallet Amount. Add more Rs. ${booking_cost - customer_details.walletAmount} to continue booking`);
                error.status = 406;
                throw error;
            }
            else {
                updateflight = await flightBookingDb.updateBooking(bookingId,noOfTickets);
                if(!updateflight){
                    error = new Error(`Update failed`);
                    error.status = 502;
                    throw error;
                }
                else return bookflight;
            }
        }
    }
}

module.exports = fBookingService;