import mongoose, { connect } from "mongoose"

export default async () =>{
     try {
          const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
          console.log("Database Connection Established")
     } catch (error) {
          console.log("Data Base Connection Failed", error)
          process.exit(1);
     }
}