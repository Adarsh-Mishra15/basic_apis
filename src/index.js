import app from "./app.js";
import dotenv from "dotenv"
import {connectDB} from "./db/db.js";

dotenv.config({
    path: "./.env",
})
connectDB()
.then(()=>{
    const port =process.env.PORT;
    app.listen(port,()=>{
        console.log(`server is running at: ${port}`)
    })
})