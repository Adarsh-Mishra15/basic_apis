import express from "express"
import cors from "cors"
import path from "path"
import {Server} from "socket.io"
import http from "http"
import { WebSocket } from "ws"

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
// Socket.io codes

// List of cryptocurrencies to fetch data for
const coins = ["btcusdt", "ethusdt", "dogeusdt"]; // Add more coins as needed

const stream = coins.map((coin) => `${coin}@trade`).join("/");
const binanceWs = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

binanceWs.on('open',()=>{
    console.log('Connected to Binance WebSocket')
})


binanceWs.on("message", (data) => {
    const parsedData = JSON.parse(data);

    // Log the parsed data (optional for debugging)
    //console.log("Received from Binance:", parsedData);

    // Emit data to all connected Socket.IO clients
    io.emit("priceUpdate", parsedData);
});


// Express related code
app.get('/',()=>{
    res.sendFile(path.resolve('public/index.html'))
})

//routes import
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)

export default server