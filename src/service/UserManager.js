import bcrypt from "bcrypt";
import User from "../models/user.js";

class UserManager {
    async createUser({ first_name, last_name, email, phone, age, password, role = "user", pets = [] }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            phone,
            age,
            password: hashedPassword,
            role,
            pets
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

    async getUserById(id) {
        return await User.findById(id);
    }

    async getUserByEmail(email) {
        return await User.findOne({ email });
    }
}

export default new UserManager();
