//Import required modules
const fs = require('fs')
//Implement errorLogger function as per the requirement
let errorLogger =  (err,req,res,next)=> {
    let err_msg = `${new Date()} - ${err.stack}\n`;
    fs.appendFile('./errorLogger.txt',err_msg,(error) => {
        if(error){
            console.log("Failed in logging error");

        }
    });
    if (err.status){
        res.status = err.status;
        res.json({"message":err.message});
    }
    else{
        res.status = 500;
        res.json({"message":err.message});
    }
}

module.exports = errorLogger;