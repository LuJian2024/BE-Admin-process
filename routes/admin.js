import express from "express";
import User from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import { authorizeJwt } from "../middleware/authorization.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const router = express.Router();

const isAdmin = (req, res, next) => {
    const userRoles = req.user.roles;

    if (!userRoles.includes("admin")) {
        return res
            .status(403)
            .json({ message: "You are not Admin,Access denied" });
    }
    next();
};

// CRUD-operations for users
router.get("/users", authorizeJwt, isAdmin, async (req, res) => {
    try {
        const { role, exact } = req.query; // exact 参数决定是否要精确匹配
        const filter = {};
        console.log(role, exact);
        // 检查是否有多个角色
        if (Array.isArray(role)) {
            // 如果需要精确匹配且包含一个角色
            // if (exact === "true") {
            //     filter.roles = {
            //         $size: 1,
            //         $elemMatch: { $in: role },
            //     };
            // }
            // 如果需要查找同时包含多个角色

            if (role.includes("user") && role.includes("admin")) {
                filter.roles = { $all: ["user", "admin"] };
            } else {
                filter.roles = { $in: role };
            }
        } else if (role) {
            // 处理单个角色
            if (exact === "true") {
                filter.roles = {
                    $size: 1,
                    $elemMatch: { $eq: role },
                };
            } else {
                filter.roles = { $in: [role] }; //$in 操作符后面必须是一个数组格式。它的作用是检查指定字段的值是否在提供的数组中匹配任何一个元素。
            }
        }
        // filter.roles = { $ne: "admin" }; // 过滤掉 admin
        // filter.roles = { $all: Array.isArray(roles) ? roles : [roles] }; // 确保将单个值转为数组

        console.log(filter);
        const users = await User.find(filter);
        // const users = await User.find({ roles: { $ne: "admin" } });
        // const users = await User.find({ roles: { $in: ["user"] } });

        return res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/user", authorizeJwt, isAdmin, async (req, res) => {
    try {
        const { name, email, password, roles } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const randomPassword = crypto.randomBytes(64).toString("hex");
        const hash = await bcrypt.hash(randomPassword, 10);

        const newUser = await User.create({
            name,
            email,
            password: password || hash,
            roles: roles || ["user"],
        });

        return res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router
    .route("/user/:id")
    .patch(authorizeJwt, isAdmin, async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                // req.body, //使用 $set：只更新传入的字段，其他字段保持不变。不使用 $set：直接替换整个文档，导致未在 req.body 中包含的字段丢失。
                { new: true } //表示返回更新后的文档（新的数据），而不是更新前的旧文档。默认情况下，findByIdAndUpdate 会返回旧文档，如果你想要返回更新后的数据，就需要设置 { new: true }。
            );
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ updatedUser });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    })
    .delete(authorizeJwt, isAdmin, async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                message: "User deleted successfully",
                deletedUser,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    });

// CRUD-operations for products
router.get("/products", authorizeJwt, isAdmin, async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 2;
        const page = Number(req.query.page) || 0;
        const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
        const sortBy = req.query.sortBy || "price";

        const products = await Product.find({
            $or: [{ category: req.query.category }, { name: req.query.name }],
        })
            .limit(limit)
            .skip(page * limit) // 正确的分页逻辑，因为 page 是从 0 开始的，所以需要乘以 limit
            .sort({
                [sortBy]: sortDirection,
            });
        return res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/product", authorizeJwt, isAdmin, async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        return res.status(200).json({ newProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// PUT or PATCH ???
router
    .route("/product/:id")
    .patch(authorizeJwt, isAdmin, async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ updatedProduct });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    })
    .delete(authorizeJwt, isAdmin, async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(
                req.params.id
            );
            if (!deletedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({
                message: "Product deleted successfully",
                deletedProduct,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    });

// CRUD-operations for orders

router.get("/orders", authorizeJwt, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "-password") // 填充 user 字段，排除 password 字段
            .populate("orderItems.product"); // 填充 orderItems 中的 product 字段
        return res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/order", authorizeJwt, isAdmin, async (req, res) => {
    try {
        // 首先验证用户是否存在
        const existingUser = await User.findById(req.body.user);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 如果用户存在，创建订单
        const newOrder = await Order.create(req.body);

        // 将订单ID添加到用户的order列表中
        existingUser.orders.push(newOrder._id);
        await existingUser.save();

        // 返回新订单
        return res
            .status(200)
            .json({ message: "Order created successfully", newOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router
    .route("/order/:id")
    .patch(authorizeJwt, isAdmin, async (req, res) => {
        try {
            const existingOrder = await Order.findById(req.params.id);

            if (!existingOrder) {
                return res.status(404).json({ message: "Order not found" });
            }

            const updateFields = {};

            // 检查是否需要更新订单状态
            if (
                existingOrder.shippingResult.status === "processing" &&
                existingOrder.paymentResult.status === "succeeded"
            ) {
                updateFields.orderStatus = "paid";
            } else if (
                existingOrder.shippingResult.status === "succeeded" &&
                existingOrder.paymentResult.status === "succeeded"
            ) {
                updateFields.orderStatus = "shipped";
            } else if (existingOrder.paymentResult.status === "cancelled") {
                updateFields.orderStatus = "cancelled";

                // // 确保 shippingResult 存在
                // if (!existingOrder.shippingResult) {
                //     existingOrder.shippingResult = {}; // 初始化为一个空对象
                // }
                updateFields.shippingResult = {
                    status: "cancelled",
                };
            }

            // 记录更新字段
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                { $set: updateFields },
                { new: true }
            );

            // 检查是否成功更新订单
            if (!updatedOrder) {
                return res.status(404).json({ message: "Order update failed" });
            }

            return res.status(200).json({
                message: "Order updated successfully",
                orderStatus: updatedOrder.orderStatus,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    })
    .delete(authorizeJwt, isAdmin, async (req, res) => {
        try {
            const existingOrder = await Order.findById(req.params.id);
            if (!existingOrder) {
                return res.status(404).json({ message: "Order not found" });
            }

            if (existingOrder.orderStatus === "cancelled") {
                const deletedOrder = await Order.findByIdAndDelete(
                    req.params.id
                );
                return res.status(200).json({
                    message: "Order deleted successfully",
                    deletedOrder,
                });
            } else {
                return res.status(400).json({
                    message:
                        "Order's status is not cancelled. Order cannot be deleted",
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    });
export default router;

//------------products---------------------------

//   {
//     "name": "Smartwatch",
//     "image": "https://example.com/images/smartwatch.jpg",
//     "brand": "BrandD",
//     "category": "Wearables",
//     "description": "A stylish smartwatch with health-tracking features and long battery life.",
//     "price": "299.99",
//     "countInStock": 75,
//     "rating": 4.4,
//     "numReviews": 15
//   }

//------------orders---------------------------

// {
//     "orderItems": [
//       {
//         "name": "4K Monitor",
//         "qty": 1,
//         "price": 399.99,
//         "product": "670c04d46a31e2c8ba34e43b"
//       },
//       {
//         "name": "Keyboard",
//         "qty": 1,
//         "price": 99.99,
//         "product": "670c04d46a31e2c8ba34e43c"
//       }
//     ],
//     "amount": {
//       "itemsPrice": {
//         "$numberDecimal": "499.98"
//       },
//       "shippingPrice": {
//         "$numberDecimal": "10.00"
//       },
//       "taxPrice": {
//         "$numberDecimal": "25.00"
//       },
//       "totalPrice": {
//         "$numberDecimal": "534.98"
//       }
//     },
//     "orderStatus": "paid",
//     "shippingAddress": {
//       "fullName": "Sarah Johnson",
//       "phone": "222-444-5555",
//       "address": {
//         "street": "789 Pine Avenue",
//         "city": "New York",
//         "postalCode": "10001",
//         "country": "USA"
//       }
//     },
//     "shippingResult": {
//       "status": "processing",
//       "deliveredAt": null
//     },
//     "paymentResult": {
//       "paymentMethod": "Credit Card",
//       "id": "payment_id_8",
//       "status": "succeeded",
//       "update_time": "2024-10-10T09:00:00Z",
//       "email_address": "sarah.johnson@example.com",
//       "paidAt": "2024-10-10T09:00:00.000Z"
//     },
//     "user": "670c169d9467cfe0f5e708a0",
//   }

//
