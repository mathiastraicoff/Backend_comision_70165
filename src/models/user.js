import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
}, {
    timestamps: true,  // Añadir campos createdAt y updatedAt
});

const User = mongoose.model("User", userSchema);

export default User;

