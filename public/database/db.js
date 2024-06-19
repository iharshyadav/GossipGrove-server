"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConfig = async () => {
    try {
        const connectionInstance = await mongoose_1.default.connect(`${process.env.DATABASE_URL}`);
        console.log(`Database Connected : ${connectionInstance.connection.port}`);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.dbConfig = dbConfig;
//# sourceMappingURL=db.js.map