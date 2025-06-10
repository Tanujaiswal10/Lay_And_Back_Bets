const express = require('express')
const app = express();
const {connecToDB} = require('./config/db')
const betRoute = require('./routes/betR')
const userRoute = require('./routes/userR')
const marketRoute = require('./routes/marketR')
const transactionRoute = require('./routes/transactionR')
const routess= require('./routes/allR')
const matchRoute = require('./routes/matchR')
const winnerRoute = require('./routes/winnerR')
const bookMakerRoute = require('./routes/bookMakerR')
const fancyRoute = require('./routes/fancyR')
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connectivity
connecToDB();

//routes
app.use("/api/bet",betRoute)
app.use("/api/user",userRoute)
app.use("/api/market",marketRoute)
app.use("/api/transaction",transactionRoute)
app.use("/api/route",routess)
app.use("/api/match",matchRoute)
app.use("/api",winnerRoute)
app.use("/api/bookmaker",bookMakerRoute)
app.use("/api/fancy",fancyRoute)



app.listen(port,()=>{
    console.log(`Server is starting at port ${port}`)
})