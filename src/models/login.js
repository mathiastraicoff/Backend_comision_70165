import UserManager from "../service/UserManager.js";
import jwt from "jsonwebtoken";

class LoginController {
    // Controlador para iniciar sesión
    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            const user = await UserManager.authenticate(email, password);
            if (!user) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            // Generar token JWT
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Enviar el token como cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600000,  
                sameSite: "Strict"
            });

            return res.status(200).json({ message: "Inicio de sesión exitoso", token });
        } catch (error) {
            return res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
        }
    }

    // Controlador para cerrar sesión
    async logoutUser(req, res) {
        res.clearCookie("token");
        return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    }
}

export default new LoginController();
