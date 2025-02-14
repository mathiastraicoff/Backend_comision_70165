import bcrypt from "bcryptjs";
import User from "../models/user.js";

class UserManager {
    async createUser({
        first_name,
        last_name,
        email,
        phone,
        age,
        password,
        role = "user",
        pets = [],
    }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            phone,
            age,
            password: hashedPassword,
            role,
            pets,
        });
        await newUser.save();
        return newUser;
    }

    async authenticate(email, password) {
        const user = await User.findOne({ email });
        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return user;
    }

    async comparePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async updateUser(id, updateData) {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }

    async getAllUsers() {
        return await User.find({});
    }
}

export default new UserManager();
