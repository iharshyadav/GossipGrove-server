"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roomName: {
        type: [String],
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
});
const StoreRoom = mongoose_1.default.models.StoreRoom || mongoose_1.default.model('StoreRoom', roomSchema);
exports.default = StoreRoom;
//# sourceMappingURL=rooms.models.js.map