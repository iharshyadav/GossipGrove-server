import mongoose from "mongoose"

export const dbConfig = async () =>{

   try {
    const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log(`Database Connected : ${connectionInstance.connection.port}`);
   } catch (error:any) {
    throw new Error(error);
   }

} 