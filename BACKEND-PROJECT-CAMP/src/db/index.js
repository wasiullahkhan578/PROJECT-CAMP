import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGO db connect");
        
    } catch (error) {
        console.log("mongo db connectin error", error);
        process.exit(1)
        
    }
 }

export default connectDB