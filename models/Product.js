import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Product name is required"],
        trim: true,
        minLength: [3, "Product name must be at least 3 characters"],
        maxLength: [100, "Product name must be at most 100 characters"]
    },
    price: {
        type: Number,
        required: true, 
        min: [0, "Product price must be at least 0"]
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: "Stock must be integer value"
        },
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
    },
},
{
    timestamps: true
})
    



export default mongoose.model("Product", productSchema);