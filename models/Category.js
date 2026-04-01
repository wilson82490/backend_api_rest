import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        default: "",
        
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