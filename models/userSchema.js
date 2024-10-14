import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String], // 定义 roles 为一个字符串数组
        enum: ["user", "admin"], // 每个元素的值必须是 "user" 或 "admin"
        default: ["user"], // 默认值是一个数组，包含 "user"
    },
    // role: {
    //     type: String,
    //     enum: ["user", "admin"],
    //     default: "user",
    // },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});

userSchema.index({ email: 1 });

export default model("User", userSchema);
