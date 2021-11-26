// import all required modules
const express = require('express');
const FlightBooking = require('../model/flightBooking')
const fBookingService = require("../service/users")
const router = express.Router()


//implement routing as per the given requirement

router.post('/bookflight', async(req,res,next) => {
    try{
        let flightBooking = new FlightBooking(req.body);
        let bookflight = await fBookingService.bookFlight(flightBooking);
        res.status = 201;
        res.json({"message":`Flight booking is successful with booking Id: ${bookflight}`})
    }
    catch(err){
        next(err);
    }
    
})

router.get('/bookingsByFlight/:flightId', async(req,res,next) => {
    try{
        let bookingflight = await fBookingService.getbookingsByFlightId(req.params.flightId);
        res.json(bookingflight);
    }
    catch(err){
        next(err);
    }
})
router.get('/getallbookings', async (req,res,next) => {
    try{
        data = await fBookingService.getAllBookings();
        console.log("in route",data);
        res.json(data);
    }
    catch(err){
        next(err);
    }
}
)
router.get('/customerBookings/:customerId/:flightId', async (req,res,next) => {
    console.log('in route',req.params);
    try{
        data = await fBookingService.customerBookingsByFlight(req.params.customerId,req.params.flightId);
        console.log("in route",data);
        res.json(data);
    }
    catch(err){
        next(err);
    }
}
)

router.put('/updateBooking/:bookingId',async (req,res,next) => {
    try{
        updatebooking = await fBookingService.updateBooking(parseInt(req.params.bookingId),parseInt(req.body.noOfTickets));
        res.json({"message":`Booking successfully updated!! updated flight details ${updatebooking}`});
    }
    catch(err){
        next(err);
    }
})


// export routing as module
module.exports = router;