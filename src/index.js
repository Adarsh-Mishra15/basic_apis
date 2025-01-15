import server from "./app.js";
import dotenv from "dotenv"
import {connectDB} from "./db/db.js";

dotenv.config({
    path: "./.env",
})
connectDB()
.then(()=>{
    const port =process.env.PORT;
    server.listen(port,()=>{
        console.log(`server is running at: ${port}`)
    })
})