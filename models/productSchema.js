import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 2000,
    },
    price: {
        type: Schema.Types.Decimal128,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
});

export default model("Product", productSchema);
