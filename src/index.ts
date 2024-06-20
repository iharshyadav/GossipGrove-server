import express,{Request,Response} from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import { Redis } from "ioredis"
import dotenv from 'dotenv';
import { dbConfig } from "./database/db"
import otpRoute from "./routes/otp.route"
import cookieparser from "cookie-parser"

dotenv.config();

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())
app.use(express.json())



// Routes
app.use('/otp', otpRoute);

const redis = new Redis(process.env.REDIS_CONNECTION_STRING)
const subRedis = new Redis(process.env.REDIS_CONNECTION_STRING)

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin:['https://realtime-webapp.vercel.app','http://localhost:3000','http://localhost:3001'],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"],
  }
});

subRedis.on("message", (channel, message) => {
  io.to(channel).emit("room-update", message)
})

subRedis.on("error", (err) => {
  console.error("Redis subscription error", err)
})

io.on("connection",async (socket) =>{

  const { id } = socket;
  // console.log(socket.id);

  socket.on("join-room", async (room : string) =>{
    // console.log("joined room : ",room)

    const subscribedRooms = await redis.smembers("subscribed-rooms")
    await socket.join(room)
    await redis.sadd(`rooms:${id}`, room)
    await redis.hincrby("room-connections", room, 1)

    if(!subscribedRooms.includes(room)){
      subRedis.subscribe(room, async (err) =>{
        if(err){
          console.error("Failed to subscribe:", err);
        }else{
          await redis.sadd("subscribed-rooms", room)
          console.log("Subscribed to room:", room)
        }
      })
    }
  })

  socket.on("disconnect", async () => {

    const { id } = socket;

    const joinedRooms = await redis.smembers(`rooms:${id}`)
    await redis.del(`rooms:${id}`)

    joinedRooms.forEach( async (room) =>{
      const remaningConnections = await redis.hincrby(`room-connections`, room , -1)

      if(remaningConnections <= 0){
        await redis.hdel(`room-connections`,room)

        subRedis.unsubscribe(room, async (err) => {
          if (err) {
            console.error("Failed to unsubscribe", err)
          } else {
            await redis.srem("subscribed-rooms", room)

            console.log("Unsubscribed from room:", room)
          }
        })
      }
    })
  })
})


const PORT = process.env.PORT || 8080

app.get('/',(req:Request,res:Response)=>{
  res.json({msg:"Server is live"})
})

server.listen(PORT, async () => {
  await dbConfig();
  console.log(`Server is listening on port: ${PORT}`)
})