import User from "../models/user.js";
import bcrypt from "bcrypt";

class UserManager {
    // Crear un nuevo usuario
    async createUser({ first_name, last_name, email, phone, age, password, isAdmin }) {
        console.log("Creando usuario con email:", email);
        const hashedPassword = await bcrypt.hash(password, 10);  
        const newUser = new User({
            first_name,
            last_name,
            email,
            phone,
            age,
            password: hashedPassword,
            isAdmin,
        });

        await newUser.save();
        console.log("Usuario creado:", newUser);
        return newUser;
    }

    // Autenticar usuario mediante email y contraseña
    async authenticate(email, password) {
        console.log("Autenticando usuario con email:", email);
        const user = await User.findOne({ email });
        if (!user) return null;

        // Verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        console.log("Usuario autenticado:", user);
        return user;
    }

    // Obtener usuario por ID
    async getUserById(id) {
        console.log("Obteniendo usuario con ID:", id);
        const user = await User.findById(id);
        console.log("Usuario encontrado:", user);
        return user;
    }

    // Obtener usuario por email
    async getUserByEmail(email) {
        console.log("Obteniendo usuario con email:", email);
        const user = await User.findOne({ email });
        console.log("Usuario encontrado:", user);
        return user;
    }

    // Comparar contraseñas
    async comparePassword(plainPassword, hashedPassword) {
        console.log("Comparando contraseñas");
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default new UserManager();
