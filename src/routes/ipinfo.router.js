import express from "express";
import fetch from "node-fetch"; 

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await fetch("https://ipinfo.io?token=7ab29ddb3c4f1b");
        const data = await response.json();
        console.log("Respuesta de la API de IP:", data);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al obtener la información de IP:", error);
        res.status(500).json({ message: "Error al obtener la información de IP" });
    }
});

export default router;
