const dbModel = require('../utilities/connection');
const FlightBooking = require('./flightBooking');

const flightBookingDb = {}
    //Do not modify or remove this method
flightBookingDb.generateId = async() => {
    let model = await dbModel.getFlightCollection();
    let ids = await model.distinct("bookings.bookingId");
    let bId = Math.max(...ids);
    return bId + 1;
}

flightBookingDb.checkCustomer = async(customerId) => {
    //fetch the customer object for the given customer Id
    let cust = await dbModel.getCustomerCollection();
    let obj = await cust.findOne({customerId:customerId});
    return obj;
}


flightBookingDb.checkBooking = async(bookingId) => {
    // fetch flight object which has the booking with the given bookingId
    let model = await dbModel.getFlightCollection();
    let obj = await model.findOne({"bookings.bookingId":bookingId})
    return obj;
}

flightBookingDb.checkAvailability = async(flightId) => {
    // fetch the flight object for the given flight Id
    let model = await dbModel.getFlightCollection();
    let obj = await model.findOne({flightId:flightId})
    return obj;
}

flightBookingDb.updateCustomerWallet = async(customerId, bookingCost) => {
    // update customer wallet by reducing the bookingCost with the wallet amount for the given customerId
    let model = await dbModel.getCustomerCollection();
    let obj = await model.updateOne(
        {customerId:customerId},
        { $inc :{ walletAmount: -bookingCost}}, {runValidators:true});
    return obj.nModified>0 ? true: false;
}

flightBookingDb.bookFlight = async(flightBooking) => {
    // book a flight ticket
    let model = await dbModel.getFlightCollection();
    let book_id = await flightBookingDb.generateId()
    flightBooking.bookingId = book_id;
    let new_doc = await model.updateOne({flightId: flightBooking.flightId},
        {$push:{bookings: flightBooking}},{runValidators:true});
    if (new_doc.nModified>0){
        let seat_update = await model.updateOne({flightId:flightBooking.flightId},
            {$inc:{availableSeats:-flightBooking.noOfTickets}},{runValidators:true})
        if (seat_update.nModified>0){
            let walletUpdate = await flightBookingDb.updateCustomerWallet(flightBooking.customerId,flightBooking.bookingCost);
            if (walletUpdate){
                return book_id;
            }
            else{
                err = new Error("Wallet not updated");
                err.status = 502;
                throw err;
            }
        }
        else{
            err = new Error("Seats not updated");
            err.status = 502;
            throw err;
        }
    }
    else{
        err = new Error("Booking failed");
        err.status = 500;
        throw err;
    }

}

flightBookingDb.getAllBookings = async() => {
    //get all the bookings done in all flights
    let model = await dbModel.getFlightCollection();
    let getbooking = await model.find({},{_id:0, bookings : 1});
    console.log(getbooking);
    return getbooking;
}

flightBookingDb.customerBookingsByFlight = async(customerId, flightId) => {
    // get all customer bookings done for a flight
    let model = await dbModel.getFlightCollection();
    let getbooking = await model.aggregate([
        {$unwind:"$bookings"},
        {
        $match:{'flightId':flightId,"bookings.customerId":customerId}
        },
        {$project:{"bookings":1,"_id":0}
    }]);
    return getbooking;
}

flightBookingDb.getbookingsByFlightId = async(flightId) => {
    // get all the bookings done for the given flightId
    let model = await dbModel.getFlightCollection();
    let getbookings = await model.find({flightId:flightId},{bookings:1,_id:0});
    console.log(getbookings);
    if (!getbookings || getbookings.length == 0) return null
    else return getbookings;

}

flightBookingDb.updateBooking = (bookingId, noOfTickets) => {
    // update no of tickets for the given bookingId
    let model = dbModel.getFlightCollection();
    let updated = dbModel.updateOne({"bookings.bookingId":bookingId},{$inc:[{"bookings.noOfTickets":noOfTickets},{availableSeats:-noOfTickets}]});
    if (updated.nModified>0){
        let flight = dbModel.findOne({'bookings.bookingId':bookingId});
        if (flight){
            let bookingc = dbModel.updateOne({'bookings.bookingId':bookingId},{$inc: {"bookings.bookingCost":flight.fare*noOfTickets}});
            if (bookingc.nModified>0){
                let custdb = dbModel.getCustomerCollection();
                let update_wall = custdb.updateOne({'customerId':flight.bookings.customerId},{$inc :{"walletAmount":-flight.fare*noOfTickets}});
                if (update_wall.nModified>0){
                    let flightdet = flightBookingDb.checkAvailability(flight.flightId);
                    return flightdet;
                }
                else{
                    return null;
                }
            }
        }
    }
    
}

module.exports = flightBookingDb;