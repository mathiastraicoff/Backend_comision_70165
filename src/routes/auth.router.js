import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";
import logger from "../utils/logger.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

router.post("/login", (req, res, next) => {
    passport.authenticate(
        "local",
        { session: false },
        async (err, user, info) => {
            logger.info("Autenticando usuario...");

            if (err) {
                logger.error(`Error en el servidor: ${err}`);
                return res.status(500).json({ message: "Error en el servidor." });
            }
            if (!user) {
                logger.error(`Credenciales inválidas: ${info?.message}`);
                return res
                    .status(401)
                    .json({ message: info?.message || "Credenciales inválidas." });
            }

            try {
                const token = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d",
                    },
                );

                let cart = await Cart.findOne({ user: user._id });
                if (!cart) {
                    cart = new Cart({ user: user._id, products: [] });
                    await cart.save();
                }
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                logger.info(`Inicio de sesión exitoso. Token emitido: ${token}`);
                return res
                    .status(200)
                    .json({ message: "Inicio de sesión exitoso.", token, redirectUrl: "/home" });
            } catch (err) {
                logger.error(`Error durante el login: ${err}`);
                res.status(500).json({ message: "Error al procesar la solicitud." });
            }
        },
    )(req, res, next);
});

router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ email: req.user.email, message: "Acceso concedido" });
});

export default router;
