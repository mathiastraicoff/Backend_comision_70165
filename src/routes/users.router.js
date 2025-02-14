import express from "express";
import userController from "../controllers/user.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

// Endpoint para crear un usuario aleatorio (mock) – solo para desarrollo/documentación
router.post("/mock", userController.createMockUser);

// Endpoints para obtener, actualizar y eliminar el perfil del usuario autenticado
router.get("/profile", authenticateToken, userController.getUserProfile);
router.put("/profile", authenticateToken, userController.updateUserProfile);
router.delete("/profile", authenticateToken, userController.deleteUserProfile);

// (Opcional) Endpoint para renderizar la vista del perfil del usuario
router.get("/profile/view", authenticateToken, userController.renderUserProfile);

// Endpoint para desarrollador: obtener todos los usuarios (si lo necesitas)
router.get("/all", authenticateToken, userController.getAllUsers);

export default router;
