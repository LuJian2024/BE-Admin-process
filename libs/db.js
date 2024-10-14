import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDB = async () => {
    try {
        mongoose.connection.on("error", (error) => {
            console.error("Failed to connect to MongoDB:", error);
        });
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
