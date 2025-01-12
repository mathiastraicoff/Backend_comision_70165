import express from "express";
import sessionController from "../controllers/session.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.use((req, res, next) => {
    next();
});

// Ruta para registrar un nuevo usuario
router.post("/register", sessionController.registerUser);

// Ruta para iniciar sesión
router.post("/login", sessionController.loginUser);

// Ruta para obtener el usuario actual (requiere autenticación)
router.get("/current", authenticateToken, sessionController.getCurrentUser);

export default router;
