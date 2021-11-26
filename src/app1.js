const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const { route } = require('./routes/routing');
const router = express.Router()
app.use(bodyparser.json())

// app.use('/user',router)
// let fun1 = (req,res,next) => {
//     console.log("function 1");
//     next();
// }

// let fun2 = (req,res,next) =>{
//     next();
//     console.log("function 2");
// }

// let fun3 = (req,res,next) =>{
//     console.log("function 3");
//     next();
// }

// app.use("/",fun2,router)

// app.all("**",fun3)

// router.get("/user",(req,res,next) =>{
//     console.log("get route");
//     next();
// })
// router.use('/user',fun1);
// app.use("/",(req,res) => {
//     console.log("app middleware");
// })

app.listen(3000);

// app.use("/api",router)
// app.all('**',(req,res,next) => {
//     console.log("app route");
//     next()
// })
// router.route("/:name").get((req,res,next) => {
//     console.log("home route",req.params);
//     next()
// })
// router.route("/name").all((req,res,next) => {
//     console.log("final route");
//     next()
// })

// app.put("/gre/",(req,res,next) => {
//     console.log("Most popular");
//     next()
// })

// app.put("/gre/runs", (req,res,next) => {
//     console.log("to find great");
//     next()
// })

// app.use('/',router)
// app.use('/runs',(req,res,next) => {
//     console.log(("you got one"));
//     next()
// })

// app.use('/gre/**',(req,res,next)=>{
//     console.log("He is god");
// })

// app.all("/**/**",(req,res)=>{
//     console.log("he id retired");
// })

// router.put("/gre/:runs",(req,res,next)=>{
//     toget = req.params.runs
//     console.log(req.body);
//     if(req.body.toget>25000){
//         console.log(req.body.name);
//         next()
//     }
// })




app.put('**',(req,res,next) =>{
    console.log("not to compare");
    next()
})
app.use('/',router)

app.use('/',(req,res,next) => {
    console.log("truth has spoken");
    next()
})
app.all('/',(req,res)=>{
    console.log('wait');
})
router.put("/compher",(req,res,next)  => {
    if (req.body.Power == "Beyond-God"){
        next()
        if (req.body.hero =="Goku"){
            console.log(req.body.hero);
            next()
        }
    }
})
