
import UserService from "../service/UserManager.js";
import jwt from "jsonwebtoken";
import passport from "passport";

class SessionController {
    async registerUser(req, res) {
        const { first_name, last_name, register_email, phone, age, register_password, confirm_password, admin_password } = req.body;

        try {
            console.log("Registrando usuario con email:", register_email);
            if (register_password !== confirm_password) {
                return res.status(400).json({ message: "Las contraseñas no coinciden" });
            }

            const existingUser = await UserService.getUserByEmail(register_email);
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }

            const newUser = await UserService.createUser({
                first_name, last_name, email: register_email, phone, age, password: register_password, isAdmin: admin_password === process.env.ADMIN_PASSWORD,
            });

            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            console.log("Usuario registrado y token emitido:", token);
            return res.redirect("/home");
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return res.status(500).json({ message: "Error al registrar usuario", error: error.message });
        }
    }

    loginUser(req, res, next) {
        passport.authenticate("local", { session: false }, async (err, user, info) => {
            console.log("Autenticando usuario...");
            if (err) {
                console.error("Error en el servidor:", err);
                return res.status(500).json({ message: "Error en el servidor." });
            }

            if (!user) {
                console.error("Credenciales inválidas:", info?.message);
                return res.status(401).json({ message: info?.message || "Credenciales inválidas." });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            console.log("Inicio de sesión exitoso y token emitido:", token);
            return res.json({ message: "Login exitoso", redirectUrl: "/home" });
        })(req, res, next);
    }

    logoutUser(req, res) {
        res.clearCookie("token");
        console.log("Usuario desconectado");
        return res.redirect("/login");
    }

    async getCurrentUser(req, res) {
        try {
            console.log("Obteniendo usuario actual con ID:", req.user.id);
            const user = await UserService.getUserById(req.user.id);
            if (!user) {
                console.error("Usuario no encontrado");
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            console.log("Usuario encontrado:", user);
            return res.json(user);
        } catch (error) {
            console.error("Error al obtener usuario actual:", error);
            return res.status(500).json({ message: "Error al obtener usuario actual", error: error.message });
        }
    }
}

export default new SessionController();
