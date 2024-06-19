import mongoose from "mongoose";


const otpSchema = new mongoose.Schema ({
    secretCode : {
      type : Number,
      required : true,
    },
    email : {
        type : String,
        required : true,
    },
    room : {
        type : String,
        required : true,
    }
})

export const Otp = mongoose.models.Otp || mongoose.model("Otp",otpSchema);