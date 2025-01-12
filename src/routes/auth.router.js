
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";

const router = Router();

router.post("/login", (req, res, next) => {
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

        try {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            let cart = await Cart.findOne({ user: user._id });
            if (!cart) {
                cart = new Cart({ user: user._id, products: [] });
                await cart.save();
            }

            // Establecer el token como cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            console.log("Inicio de sesión exitoso y token emitido:", token);
            return res.status(200).json({ message: "Inicio de sesión exitoso.", redirectUrl: "/home" });
        } catch (err) {
            console.error("Error durante el login:", err);
            res.status(500).json({ message: "Error al procesar la solicitud." });
        }
    })(req, res, next);
});

export default router;

