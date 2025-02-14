import passport from "passport";
import UserService from "../service/UserManager.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateUser } from "../utils/user.utils.js";
import logger from "../utils/logger.js";

class SessionController {
    async registerUser(req, res) {
        const {
            first_name,
            last_name,
            register_email,
            phone,
            age,
            register_password,
            confirm_password,
            admin_password,
        } = req.body;

        try {
            if (register_password !== confirm_password) {
                return res.status(400).json({ message: "Las contraseñas no coinciden" });
            }

            const existingUser = await UserService.getUserByEmail(register_email);
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }

            const role = admin_password === process.env.ADMIN_PASSWORD ? "admin" : "user";

            const newUser = await UserService.createUser({
                first_name,
                last_name,
                email: register_email,
                phone,
                age,
                password: register_password,
                role,
            });

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "4h",
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

            logger.info(`Usuario registrado exitosamente: ${newUser.email}`);
            return res.redirect("/home");
        } catch (error) {
            logger.error(`Error al registrar usuario: ${error.message}`);
            return res.status(500).json({
                message: "Error al registrar usuario",
                error: error.message,
            });
        }
    }

    async loginUser(req, res, next) {
        passport.authenticate(
            "local",
            { session: false },
            async (err, user, info) => {
                if (err) {
                    logger.error(`Error en el servidor: ${err}`);
                    return res.status(500).json({ message: "Error en el servidor." });
                }

                if (!user) {
                    logger.error(`Credenciales inválidas: ${info?.message}`);
                    return res.status(401).json({ message: info?.message || "Credenciales inválidas." });
                }

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "4h",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });

                logger.info(`Login exitoso para el usuario: ${user.email}`);
                return res.json({ message: "Login exitoso", token, redirectUrl: "/home" }); 
            },
        )(req, res, next);
    }

    async getCurrentUser(req, res) {
        try {
            const user = await UserService.getUserById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.json(user);
        } catch (error) {
            logger.error(`Error al obtener usuario actual: ${error.message}`);
            return res.status(500).json({
                message: "Error al obtener usuario actual",
                error: error.message,
            });
        }
    }

    async createMockingUser(req, res) {
        try {
            const user = await generateUser();
            user.password = await bcrypt.hash("coder123", 10);
            user.isAdmin = Math.random() > 0.5;
            const newUser = await UserService.createUser(user);
            res.json(newUser);
        } catch (error) {
            logger.error(`Error al generar usuario de mock: ${error.message}`);
            res.status(500).json({
                message: "Error al generar usuario",
                error: error.message,
            });
        }
    }

    async createMockingUserWithoutResponse() {
        try {
            const user = await generateUser();
            user.password = await bcrypt.hash("coder123", 10);
            user.isAdmin = Math.random() > 0.5;
            const newUser = await UserService.createUser(user);
            return newUser;
        } catch (error) {
            logger.error(`Error al generar usuario de mock: ${error.message}`);
            throw new Error("Error al generar usuario");
        }
    }

    async createMockingUsers(count) {
        const users = [];
        for (let i = 0; i < count; i++) {
            const user = await generateUser();
            users.push(user);
        }
        return users;
    }
}

export default new SessionController();
