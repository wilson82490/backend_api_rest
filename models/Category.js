import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [50, "Name must be at most 50 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, "Description must be at most 500 characters"]
    },
  /*   type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryType",
        required: true,
    } */
},
{
    timestamps: true
})
    



export default mongoose.model("Category", categorySchema);