const express = require('express');
const create = require("./model/dbsetup")
const app = express();
const bodyparser = require('body-parser');
const requestLogger = require("./utilities/requestlogger")
const errorLogger = require("./utilities/errorlogger");
const router = require("./routes/routing");


// Import necessary modules and configure the middleware in proper order
// Note :  Do not remove any code which is already given 
app.use(bodyparser.json());
app.use(requestLogger);
app.use('/',router);
app.use(errorLogger);



app.get('/setupDb', async(req, res, next) => {
    try {
        let data = await create.setupDb();
        res.send(data)
    } catch (err) {
        res.send("Error occurred during insertion of data")
    }
})



if (!module.parent) {
    app.listen(1050);
}
console.log("Server listening in port 1050");


module.exports = app;