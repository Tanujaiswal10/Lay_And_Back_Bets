const express = require('express')
const app = express();
const {Server} = require('socket.io')
const path = require('path');
const http = require('http')
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


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const port = 8000;


app.use(express.static(path.join(__dirname, 'public')));
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

app.get("/",(req,res)=>{
    return res.send("hey")
})


io.on('connection', (socket) => {
  console.log('A user connected');

  const interval = setInterval(() => {
    const odds = [
      { team: "India", odds: (Math.random() * (2 - 1) + 1).toFixed(2), type: "back" },
      { team: "India", odds: (Math.random() * (3 - 1) + 1).toFixed(2), type: "lay" },
      { team: "Australia", odds: (Math.random() * (3 - 1.5) + 1.5).toFixed(2), type: "back" },
      { team: "Australia", odds: (Math.random() * (3 - 2) + 1.5).toFixed(2), type: "lay" }

    ];
    socket.emit('oddsUpdate', odds);
  }, 3000);

  socket.on('disconnect', () => {
    console.log('User disconnected ');
    clearInterval(interval);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

