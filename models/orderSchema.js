import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        //order status
        orderItems: [
            {
                name: String,
                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                // image: String,
                price: Number,
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],

        //使用 Decimal128 来存储 amount 中的价格字段，防止浮点数精度问题
        amount: {
            itemsPrice: {
                type: Schema.Types.Decimal128,
                required: true,
            },
            shippingPrice: {
                type: Schema.Types.Decimal128,
                required: true,
            },
            taxPrice: {
                type: Schema.Types.Decimal128,
                required: true,
            },
            totalPrice: {
                type: Schema.Types.Decimal128,
                required: true,
            },
        },

        orderStatus: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        //shipping status
        shippingAddress: {
            fullName: String,
            phone: String,
            address: {
                street: String,
                city: String,
                postalCode: String,
                country: String,
            },
        },
        shippingResult: {
            status: {
                type: String,
                enum: ["pending", "succeeded", "processing", "cancelled"],
            },
            // isDelivered: Boolean,
            deliveredAt: Date,
        },
        //payment status
        paymentResult: {
            paymentMethod: {
                type: String,
                default: "PayPal",
                enum: ["PayPal", "Alipay", "Credit Card", "Master Card"],
            },
            id: String,
            status: {
                type: String,
                enum: [
                    "pending",
                    "succeeded",
                    "processing",
                    "cancelled",
                    "failed",
                ],
            },
            update_time: String,
            email_address: String,
            // isPaid: Boolean,
            paidAt: Date,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

//创建此索引的作用主要是提高基于 user 字段的查询性能。
orderSchema.index({ user: 1 });

export default model("Order", orderSchema);
