
import express from "express";
import SessionController from "../controllers/session.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log("Ruta de sesión llamada:", req.path);
    next();
});

// Ruta para registrar un nuevo usuario
router.post("/register", SessionController.registerUser);

// Ruta para iniciar sesión
router.post("/login", SessionController.loginUser);

// Ruta para obtener el usuario actual (requiere autenticación)
router.get("/current", authenticateToken, SessionController.getCurrentUser);

export default router;

