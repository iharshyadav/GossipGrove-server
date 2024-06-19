"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashedRoom = exports.getPrivateRoom = exports.login = exports.otpSend = void 0;
const otp_models_1 = require("../models/otp.models");
const email_1 = require("../helper/email");
const features_1 = require("../utils/features");
const otpSend = async (req, res) => {
    try {
        console.log(req.body);
        const { email, secretCode, room } = req.body;
        // console.log(paraurl)
        if (!email || !secretCode || !room) {
            throw new Error("please fill all the details");
        }
        const sameEmail = await otp_models_1.Otp.findOne({ email });
        if (sameEmail) {
            throw new Error("Otp already sent");
        }
        await (0, email_1.myfunction)(req, email, secretCode, res);
        const otp = await otp_models_1.Otp.create({
            email,
            secretCode,
            room
        });
        if (!otp) {
            throw new Error("Not saved to database");
        }
        console.log(otp);
        return res.status(200).json({
            message: "Otp saved",
            otp
        });
    }
    catch (error) {
        throw new Error("Unable to verify email please try again");
    }
};
exports.otpSend = otpSend;
const login = async (req, res) => {
    try {
    }
    catch (error) {
        throw new Error("failed to storenroom");
    }
};
exports.login = login;
const getPrivateRoom = async (req, res) => {
    try {
        const { email, rooms, otp } = req.body;
        if (!email || !rooms || !otp) {
            throw new Error("please fill all the details");
        }
        const findByEmail = await otp_models_1.Otp.findOne({ email });
        if (!findByEmail) {
            throw new Error("Failed to join room");
        }
        const { room } = findByEmail;
        // console.log(room)  
        // console.log(rooms)
        if (rooms != room) {
            throw new Error("Please Enter the correct room Name");
        }
        const { secretCode } = findByEmail;
        if (otp != secretCode) {
            throw new Error("Invalid Otp!!! Please try again!!!!");
        }
        (0, features_1.saveOtpStoreRoom)(email, room);
        const deleteotp = await otp_models_1.Otp.findOneAndDelete({ email });
        if (!deleteotp) {
            throw new Error("Enable to delete Otp");
        }
        // sendToken(res,findByEmail,200,"user entered successfully");
        return res.status(200).json({
            success: true,
            message: "user otp is correct",
            deleteotp
            // token, 
            // room:decoded.room
        });
    }
    catch (error) {
        throw new Error("failed to store room");
    }
};
exports.getPrivateRoom = getPrivateRoom;
const hashedRoom = async (req, res) => {
};
exports.hashedRoom = hashedRoom;
//# sourceMappingURL=otpVerify.js.map