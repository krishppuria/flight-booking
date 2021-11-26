let Validator = {};

Validator.validateFlightId = function (flightId) {
   // validate the flightId 
   if(!flightId.match(/^IND-[1-9][0-9][0-9]$/)){
       error = new Error("Error in flight Id");
       error.status = 406;
       throw error;
   }
}


Validator.validateBookingId = function (bookingId) {
    // validate the bookingId
    if(new String(bookingId).length !=4 ){
        error = new Error("Error in booking Id");
        error.status = 406;
        throw error;
    }
}

module.exports = Validator;