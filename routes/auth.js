import express from "express";
import User from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { authorizeJwt } from "../middleware/authorization.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", authorizeJwt, async (req, res) => {
    try {
        const { roles, _id } = req.user;
        console.log(req.user);
        // 登录成功，根据用户角色跳转
        // if (roles.includes("admin")) {
        //     return res.status(200).json({
        //         message: "Login successful. Admin access",
        //         url: "http://localhost:3000/auth/admins",
        //     });
        //     // return res.redirect("http://localhost:3000/admin/users");
        // } else if (roles.includes("user")) {
        //     return res.status(200).json({
        //         message: "Login successful. User access",
        //         url: "http://localhost:3000/auth/users",
        //     });
        //     // return res.redirect("http://localhost:3000/user/orders");
        // } else {
        //     return res
        //         .status(403)
        //         .json({ message: "Access denied: Unknown role" });
        // }

        // 登录成功，根据用户角色返回相应的数据。如果是admin，则返回用户列表和他的订单信息，所有货物信息以及所有订单信息。
        if (roles.includes("admin")) {
            const usersList = await User.find()
                .populate("order")
                .select("-password"); //不显示密码
            const productsList = await Product.find();
            const ordersList = await Order.find()
                .populate("user")
                .populate("orderItems.product");

            let response = {
                message:
                    "Login successful. Admin access, here is your users-list and products-list",
                users: usersList,
                products: productsList,
                orders: ordersList,
            };

            // 如果用户同时是 admin 和 user，返回个人订单信息
            if (roles.includes("user")) {
                const userWithOrders = await User.findById({ _id })
                    .populate("order")
                    .select("-password");
                response.personal = {
                    message:
                        "You are also a User and get User Access, here is your orders",
                    userWithOrders,
                };
            }
            return res.status(200).json({ response });
        }

        //如果是user，则返回他本人的信息和相关的订单信息。
        if (roles.includes("user")) {
            const userWithOrders = await User.findById({ _id })
                .populate("order")
                .select("-password"); //不显示密码
            return res.status(200).json({
                message: "Login successful. User access, here is your orders",
                userWithOrders,
            });
        }

        // return res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// router.get("/admins", authorizeJwt, async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user._id }).select(
//             "orderItems"
//         );
//         return res.status(200).json({ orders });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "you are not registered" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = JWT.sign(
            { _id: user._id, roles: user.roles },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("jwt", token, {
            httpOnly: true, // 只能通过HTTP（即客户端JS无法访问）访问
            secure: process.env.NODE_ENV === "production", // 生产环境下为true，现在是开发环境，可以为false
            // sameSite: "strict",
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, roles: user.roles },
        });
    } catch (error) {
        console.error("Login error:", error); // 记录错误信息
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/logout", (req, res) => {
    try {
        // 清除JWT cookie，确保 httpOnly，secure 和 sameSite 与登录时一致
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // 在生产环境中可以设置为 true
            sameSite: "lax", // 必须与登录时的配置一致
        });

        // 返回成功的响应
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "Internal server error during logout",
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 检查必填字段
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 检查是否存在已注册的用户
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // 密码加密
        const hash = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = await User.create({ name, email, password: hash });
        res.status(201).json({
            message: "Registration successful",
            user: { name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        // 捕获和处理数据库和其他错误
        console.error("Error during user registration:", error);

        // 处理特定的数据库错误，比如重复的邮箱
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 其他可能的服务器错误
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;

// {
//     "name": "John Doe",
//     "email": "john.doe@example.com",
//     "password": "hashed_password_3"  // $2b$10$hHtS59DRPsKtmLz6pIuZkuGHJD1Oa.aTyRtrYjNGN/6E5Q/X10X0u
//   }

// {
//     name:  "Alice Johnson",
//     email: "alice.johnson@example.com",
//     password: "hashed_password_1", // $2b$10$NIMAGE9H60qaGujzfRJhYOxXInX36tuCv6IW.2z1PUv4tXndE6q/a
// }

// {"name":"Bob Smith",
// "email":"bob.smith@example.com",
// "password":"hashed_password_2" // $2b$10$So7UIYblVl88hgP1h/gNpO6Ztql.dvhY5QNIYO4XkGMrB/yanU4le
// }

// password:"hashed_password_4" // $2b$10$I1QZqhlqaceVvGG.JoNE1ue0Ef6hmvQ.tTailbJDuAddC.Fn31aRi

// password:"hashed_password_5" // $2b$10$KZRXx1ZPDUPjPXcGoEu/PeZMidt7cRCb22m0JT6qFE7Pxb67K4aBu

// password:"hashed_password_6"  // $2b$10$0/7WV.Msijrk5vk8uqzGZeiCyqOu6pfeAA./HSBaxcoT7SykPQsJa
