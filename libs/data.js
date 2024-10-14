import mongoose from "mongoose";
export const users = [
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "hashed_password_1", // 请确保使用哈希函数处理密码
        roles: ["user"],
        order: [],
    },
    {
        name: "Bob Smith",
        email: "bob.smith@example.com",
        password: "hashed_password_2",
        roles: ["admin", "user"],
        order: [],
    },
];

export const products = [
    {
        name: "Gaming Laptop",
        image: "https://example.com/images/laptop.jpg",
        brand: "BrandA",
        category: "Electronics",
        description:
            "A high-performance gaming laptop with excellent graphics.",
        price: mongoose.Types.Decimal128.fromString("1299.99"),
        countInStock: 50,
        rating: 4.5,
        numReviews: 10,
    },
    {
        name: "Wireless Headphones",
        image: "https://example.com/images/headphones.jpg",
        brand: "BrandB",
        category: "Accessories",
        description:
            "Noise-cancelling wireless headphones for an immersive sound experience.",
        price: mongoose.Types.Decimal128.fromString("199.99"),
        countInStock: 100,
        rating: 4.7,
        numReviews: 20,
    },
    {
        name: "Smartphone",
        image: "https://example.com/images/smartphone.jpg",
        brand: "BrandC",
        category: "Electronics",
        description: "Latest model smartphone with cutting-edge features.",
        price: mongoose.Types.Decimal128.fromString("799.99"),
        countInStock: 200,
        rating: 4.8,
        numReviews: 15,
    },
];

export const orders = [
    {
        orderItems: [
            {
                name: "Gaming Laptop",
                qty: 1,
                price: mongoose.Types.Decimal128.fromString("1299.99"),
                product: products[0]._id, // 引用产品
            },
            {
                name: "Wireless Headphones",
                qty: 2,
                price: mongoose.Types.Decimal128.fromString("199.99"),
                product: products[1]._id, // 引用产品
            },
        ],
        amount: {
            itemsPrice: mongoose.Types.Decimal128.fromString("1699.97"),
            shippingPrice: mongoose.Types.Decimal128.fromString("20.00"),
            taxPrice: mongoose.Types.Decimal128.fromString("85.00"),
            totalPrice: mongoose.Types.Decimal128.fromString("1804.97"),
        },
        orderStatus: "paid",
        shippingAddress: {
            fullName: "Alice Johnson",
            phone: "123-456-7890",
            address: {
                street: "123 Elm St",
                city: "Springfield",
                postalCode: "12345",
                country: "USA",
            },
        },
        shippingResult: {
            status: "succeeded",
            deliveredAt: new Date("2024-10-01"),
        },
        paymentResult: {
            paymentMethod: "Credit Card",
            id: "payment_id_1",
            status: "succeeded",
            update_time: "2024-10-01T12:00:00Z",
            email_address: "alice.johnson@example.com",
            paidAt: new Date("2024-10-01"),
        },
        user: users[0]._id, // 引用用户
    },
    {
        orderItems: [
            {
                name: "Smartphone",
                qty: 1,
                price: mongoose.Types.Decimal128.fromString("799.99"),
                product: products[2]._id, // 引用产品
            },
        ],
        amount: {
            itemsPrice: mongoose.Types.Decimal128.fromString("799.99"),
            shippingPrice: mongoose.Types.Decimal128.fromString("15.00"),
            taxPrice: mongoose.Types.Decimal128.fromString("40.00"),
            totalPrice: mongoose.Types.Decimal128.fromString("854.99"),
        },
        orderStatus: "pending",
        shippingAddress: {
            fullName: "Bob Smith",
            phone: "098-765-4321",
            address: {
                street: "456 Maple Ave",
                city: "Springfield",
                postalCode: "12345",
                country: "USA",
            },
        },
        shippingResult: {
            status: "processing",
            deliveredAt: null,
        },
        paymentResult: {
            paymentMethod: "PayPal",
            id: "payment_id_2",
            status: "processing",
            update_time: "2024-10-02T12:00:00Z",
            email_address: "bob.smith@example.com",
            paidAt: null,
        },
        user: users[1]._id, // 引用用户
    },
    {
        orderItems: [
            {
                name: "Wireless Headphones",
                qty: 1,
                price: mongoose.Types.Decimal128.fromString("199.99"),
                product: products[1]._id, // 引用产品
            },
        ],
        amount: {
            itemsPrice: mongoose.Types.Decimal128.fromString("199.99"),
            shippingPrice: mongoose.Types.Decimal128.fromString("5.00"),
            taxPrice: mongoose.Types.Decimal128.fromString("10.00"),
            totalPrice: mongoose.Types.Decimal128.fromString("214.99"),
        },
        orderStatus: "shipped",
        shippingAddress: {
            fullName: "Alice Johnson",
            phone: "123-456-7890",
            address: {
                street: "123 Elm St",
                city: "Springfield",
                postalCode: "12345",
                country: "USA",
            },
        },
        shippingResult: {
            status: "succeeded",
            deliveredAt: new Date("2024-10-03"),
        },
        paymentResult: {
            paymentMethod: "Alipay",
            id: "payment_id_3",
            status: "succeeded",
            update_time: "2024-10-02T12:00:00Z",
            email_address: "alice.johnson@example.com",
            paidAt: new Date("2024-10-02"),
        },
        user: users[0]._id, // 引用用户
    },
    {
        orderItems: [
            {
                name: "Smartphone",
                qty: 2,
                price: mongoose.Types.Decimal128.fromString("799.99"),
                product: products[2]._id, // 引用产品
            },
        ],
        amount: {
            itemsPrice: mongoose.Types.Decimal128.fromString("1599.98"),
            shippingPrice: mongoose.Types.Decimal128.fromString("20.00"),
            taxPrice: mongoose.Types.Decimal128.fromString("80.00"),
            totalPrice: mongoose.Types.Decimal128.fromString("1699.98"),
        },
        orderStatus: "delivered",
        shippingAddress: {
            fullName: "Bob Smith",
            phone: "098-765-4321",
            address: {
                street: "456 Maple Ave",
                city: "Springfield",
                postalCode: "12345",
                country: "USA",
            },
        },
        shippingResult: {
            status: "succeeded",
            deliveredAt: new Date("2024-10-04"),
        },
        paymentResult: {
            paymentMethod: "Credit Card",
            id: "payment_id_4",
            status: "succeeded",
            update_time: "2024-10-04T12:00:00Z",
            email_address: "bob.smith@example.com",
            paidAt: new Date("2024-10-04"),
        },
        user: users[1]._id, // 引用用户
    },
    {
        orderItems: [
            {
                name: "Gaming Laptop",
                qty: 1,
                price: mongoose.Types.Decimal128.fromString("1299.99"),
                product: products[0]._id, // 引用产品
            },
        ],
        amount: {
            itemsPrice: mongoose.Types.Decimal128.fromString("1299.99"),
            shippingPrice: mongoose.Types.Decimal128.fromString("25.00"),
            taxPrice: mongoose.Types.Decimal128.fromString("65.00"),
            totalPrice: mongoose.Types.Decimal128.fromString("1389.99"),
        },
        orderStatus: "cancelled",
        shippingAddress: {
            fullName: "Alice Johnson",
            phone: "123-456-7890",
            address: {
                street: "123 Elm St",
                city: "Springfield",
                postalCode: "12345",
                country: "USA",
            },
        },
        shippingResult: {
            status: "cancelled",
            deliveredAt: null,
        },
        paymentResult: {
            paymentMethod: "PayPal",
            id: "payment_id_5",
            status: "cancelled",
            update_time: "2024-10-05T12:00:00Z",
            email_address: "alice.johnson@example.com",
            paidAt: null,
        },
        user: users[0]._id, // 引用用户
    },
];
