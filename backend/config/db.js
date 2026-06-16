import mongoose from "mongoose";
const connectDB=async()=>{
    // console.log(process.env.MONGO_URI);
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    }
    catch(error){
        console.log('MongoDB connection failed:',error);
        process.exit(1);

    }
};

export default connectDB;