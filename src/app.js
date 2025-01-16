import express from "express"
import cors from "cors"
import path from "path"
import {Server} from "socket.io"
import http from "http"
import { WebSocket } from "ws"
import client from "./utils/client.js"

const app = express()
const server = http.createServer(app)

const io = new Server(server)

app.use(express.json())

app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.resolve('public')));


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
// Socket.io related codes

// List of cryptocurrencies to fetch data for
const coins = [
  "btcusdt", "ethusdt", "dogeusdt", 
  "xrpusdt", "adausdt"
];
// Add more coins as needed

const stream = coins.map((coin) => `${coin}@trade`).join("/");
const binanceWs = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

binanceWs.on('open',()=>{
    console.log('Connected to Binance WebSocket')
})


binanceWs.on("message", (data) => {
    const parsedData = JSON.parse(data);
    const { s: symbol, p: price, q: quantity } = parsedData;

    // Store the complete data in Redis for 10 seconds expiration
    (async ()=>{
        await client.set(symbol, JSON.stringify(parsedData), 'EX', 10);
      
        // Fetch the cached data from Redis
        const cachedData = await client.get(symbol);
        if (cachedData) {
          // Emit the cached data to clients
          io.emit("priceUpdate", { ...JSON.parse(cachedData), s: symbol });
        } else {
          // If not cached, send the real-time data (fallback)
          io.emit("priceUpdate", parsedData);
        }
    })()
  
  });


// Express related code
app.get('/',()=>{
    res.sendFile(path.resolve('public/index.html'))
})

//routes import
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)

//email routes
import emailRouter from "./routes/email.routes.js";
app.use("/api/v1/email", emailRouter);


export default server