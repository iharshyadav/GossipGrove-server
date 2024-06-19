"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const ioredis_1 = require("ioredis");
require("dotenv/config");
const db_1 = require("./database/db");
const otp_route_1 = __importDefault(require("./routes/otp.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Routes
app.use('/otp', otp_route_1.default);
const redis = new ioredis_1.Redis(process.env.REDIS_CONNECTION_STRING);
const subRedis = new ioredis_1.Redis(process.env.REDIS_CONNECTION_STRING);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['https://realtime-webapp.vercel.app', 'http://localhost:3000'],
        methods: ["GET", "POST"],
        credentials: true,
    }
});
subRedis.on("message", (channel, message) => {
    io.to(channel).emit("room-update", message);
});
subRedis.on("error", (err) => {
    console.error("Redis subscription error", err);
});
io.on("connection", async (socket) => {
    const { id } = socket;
    // console.log(socket.id);
    socket.on("join-room", async (room) => {
        // console.log("joined room : ",room)
        const subscribedRooms = await redis.smembers("subscribed-rooms");
        await socket.join(room);
        await redis.sadd(`rooms:${id}`, room);
        await redis.hincrby("room-connections", room, 1);
        if (!subscribedRooms.includes(room)) {
            subRedis.subscribe(room, async (err) => {
                if (err) {
                    console.error("Failed to subscribe:", err);
                }
                else {
                    await redis.sadd("subscribed-rooms", room);
                    console.log("Subscribed to room:", room);
                }
            });
        }
    });
    socket.on("disconnect", async () => {
        const { id } = socket;
        const joinedRooms = await redis.smembers(`rooms:${id}`);
        await redis.del(`rooms:${id}`);
        joinedRooms.forEach(async (room) => {
            const remaningConnections = await redis.hincrby(`room-connections`, room, -1);
            if (remaningConnections <= 0) {
                await redis.hdel(`room-connections`, room);
                subRedis.unsubscribe(room, async (err) => {
                    if (err) {
                        console.error("Failed to unsubscribe", err);
                    }
                    else {
                        await redis.srem("subscribed-rooms", room);
                        console.log("Unsubscribed from room:", room);
                    }
                });
            }
        });
    });
});
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
    res.json({ msg: "Server is live" });
});
server.listen(PORT, async () => {
    await (0, db_1.dbConfig)();
    console.log(`Server is listening on port: ${PORT}`);
});
//# sourceMappingURL=server.js.map