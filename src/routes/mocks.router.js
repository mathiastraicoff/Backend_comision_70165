import { Router } from "express";
import sessionController from "../controllers/session.controller.js";
import { generatePets } from "../utils/pet.utils.js";

const router = Router();

// Ruta para generar 50 usuarios mock
router.get("/mockingusers", async (req, res) => {
    try {
        const users = await sessionController.createMockingUsers(50);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error generando usuarios mock:", error);
        res.status(500).json({ message: "Error generando usuarios mock", error: error.message });
    }
});

// Ruta para generar 100 mascotas mock
router.get("/mockingpets", async (req, res) => {
    try {
        const pets = generatePets(100);
        res.status(200).json(pets);
    } catch (error) {
        console.error("Error generando mascotas mock:", error);
        res.status(500).json({ message: "Error generando mascotas mock", error: error.message });
    }
});

// Ruta para generar usuarios y mascotas con parámetros
router.post("/generateData", async (req, res) => {
    const { users, pets } = req.body;

    if (typeof users !== 'number' || typeof pets !== 'number') {
        return res.status(400).json({ message: "Los parámetros 'users' y 'pets' deben ser numéricos" });
    }

    try {
        const userPromises = [];
        for (let i = 0; i < users; i++) {
            userPromises.push(sessionController.createMockingUserWithoutResponse());
        }
        const generatedUsers = await Promise.all(userPromises);
        const generatedPets = generatePets(pets);
        res.status(201).json({ message: `Se generaron ${users} usuarios y ${pets} mascotas.`, users: generatedUsers, pets: generatedPets });
    } catch (error) {
        console.error("Error generando datos de mock:", error);
        res.status(500).json({ message: "Error generando datos de mock", error: error.message });
    }
});

export default router;

