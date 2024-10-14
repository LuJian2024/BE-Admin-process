import { users, products, orders } from "./libs/data.js";
import User from "./models/userSchema.js";
import Product from "./models/productSchema.js";
import Order from "./models/orderSchema.js";
import { connectToDB } from "./libs/db.js";

const seed = async () => {
    await connectToDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Database cleared");

    try {
        const createdUsers = await User.create(users);
        const createdProducts = await Product.create(products);

        const updateOrders = orders.map((order) => {
            order.orderItems = order.orderItems.map((orderItem) => {
                const product = createdProducts.find(
                    (product) => product.name === orderItem.name
                );
                if (product) {
                    orderItem.product = product._id;
                }
                return orderItem;
            });

            const user = createdUsers.find(
                (user) => user.email === order.paymentResult.email_address
            );
            if (user) {
                order.user = user._id;
            }
            return order;
        });

        const createdOrders = await Order.create(updateOrders);

        for (const order of createdOrders) {
            const user = await User.findById(order.user);
            if (user) {
                user.orders.push(order._id);
                await user.save();
            }
        }
    } catch (error) {
        console.error("Error creating orders:", error);
    }
};
seed();
