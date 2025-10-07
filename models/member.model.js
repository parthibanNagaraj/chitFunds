import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Name is Required"],
            trim:true
        },
        email:{
            type:String,
            required:[true, "Email is Required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        role: {
        type: String,
        enum: ["Admin", "Manager", "User"],
        default: "User",
        },
        status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
        },
        createdAt: {
        type: Date,
        default: Date.now,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

const User = mongoose.model("User", userSchema);
export default User;