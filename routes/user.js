import express from "express";
import User from "../models/userSchema.js";
import Order from "../models/orderSchema.js";

const router = express.Router();

router.patch("/update-order/:id", async (req, res) => {
    try {
        const existingOrder = await Order.findById(req.params.id);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 检查订单状态，已发货或已取消的订单不允许修改
        if (existingOrder.shippingResult.status === "succeeded") {
            return res.status(400).json({
                message: "Order already shipped, modification not allowed.",
            });
        }
        if (
            existingOrder.paymentResult.status === "cancelled" ||
            existingOrder.orderStatus === "cancelled"
        ) {
            return res.status(400).json({
                message: "Order has been cancelled, modification not allowed.",
            });
        }

        if (!req.body.shippingAddress) {
            return res.status(400).json({
                message:
                    "Invalid shipping address, please provide a valid shipping address.",
                olderShippingAddress: existingOrder.shippingAddress,
            });
        }
        // existingOrder.shippingAddress = req.body.shippingAddress; // 直接修改订单对象
        // await existingOrder.save(); // 保存修改

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { shippingAddress: req.body.shippingAddress } },
            { new: true }
        );
        return res.status(200).json({ updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

//---------------------------------------
// {"shippingAddress": {
//     "address": {
//       "street": "123 Elm St",
//       "city": "Springfield",
//       "postalCode": "12345",
//       "country": "DE"
//     },
//     "fullName": "Alice Johnson",
//     "phone": "123-456-7890"
//   }}
//---------------------------------------

router.delete("/delete-order/:id", async (req, res) => {
    try {
        const existingOrder = await Order.findById(req.params.id);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 检查订单状态，已发货，已付款或已取消的订单不允许删除，只有等待付款的订单可以删除
        switch (existingOrder.orderStatus) {
            case "pending":
                // 软删除：将订单状态更改为 "cancelled"
                existingOrder.orderStatus = "cancelled";
                await existingOrder.save();
                return res.status(200).json({
                    message: "Order cancelled successfully",
                    updatedOrder: existingOrder,
                });

            case "paid":
                return res
                    .status(400)
                    .json({ message: "Order is paid, deletion not allowed." });

            case "delivered":
                return res.status(400).json({
                    message: "Order is delivered, deletion not allowed.",
                });

            case "shipped":
                return res.status(400).json({
                    message: "Order is shipped, deletion not allowed.",
                });

            case "cancelled":
                return res
                    .status(400)
                    .json({ message: "Order is already cancelled." });

            default:
                return res
                    .status(400)
                    .json({ message: "Unknown order status." });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "server error", error: error.message });
    }
});

export default router;
