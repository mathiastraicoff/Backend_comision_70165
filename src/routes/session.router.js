import express from "express";
import sessionController from "../controllers/session.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/register", sessionController.registerUser);
router.post("/login", sessionController.loginUser);
router.get("/current", authenticateToken, sessionController.getCurrentUser);
router.post("/logout", authenticateToken, (req, res) => {
	res.clearCookie("token");
	return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
