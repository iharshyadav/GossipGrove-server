import { Router } from "express";
import { getPrivateRoom, otpSend, login } from "../controller/otpVerify";
import cors from "cors"

const route = Router()


// route.post("/roomSave",postPrivateRoom)
const allowedOrigins = ['https://realtime-webapp.vercel.app', 'http://localhost:3000'];
route.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))
route.post("/otpVerify",otpSend)
route.post("/getRoom",getPrivateRoom)

export default route;