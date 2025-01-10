import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import { apiError } from "../utils/apiError.js"

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Connection is successfully established")
    } catch (error) {
        throw new apiError(401,"MONGODB connection ERROR",error);
    }
}

export {connectDB}