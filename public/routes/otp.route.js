"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpVerify_1 = require("../controller/otpVerify");
const cors_1 = __importDefault(require("cors"));
const route = (0, express_1.Router)();
// route.post("/roomSave",postPrivateRoom)
const allowedOrigins = ['https://realtime-webapp.vercel.app', 'http://localhost:3000'];
route.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
route.post("/otpVerify", otpVerify_1.otpSend);
route.post("/getRoom", otpVerify_1.getPrivateRoom);
exports.default = route;
//# sourceMappingURL=otp.route.js.map