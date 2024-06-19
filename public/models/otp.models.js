"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    secretCode: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    }
});
exports.Otp = mongoose_1.default.models.Otp || mongoose_1.default.model("Otp", otpSchema);
//# sourceMappingURL=otp.models.js.map