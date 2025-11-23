import mongoose from "mongoose";

const mongodbConn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("Error at connecting");
        process.exit(1);
    }
};
export default mongodbConn;
