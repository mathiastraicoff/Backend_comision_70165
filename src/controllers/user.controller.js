import UserManager from "../service/UserManager.js";
import { faker } from "@faker-js/faker"; 

// Obtiene el perfil del usuario autenticado
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserManager.getUserById(userId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

// Actualiza el perfil del usuario autenticado
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const updatedUser = await UserManager.updateUser(userId, updateData);
        if (!updatedUser)
            return res.status(404).json({ error: "Usuario no encontrado" });
        
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

// Elimina el perfil del usuario autenticado
const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        await UserManager.deleteUser(userId);
        res.clearCookie("token");

        return res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

// Función para crear un usuario aleatorio (solo para desarrollo/documentación)
const createMockUser = async (req, res) => {
    try {
        const randomUser = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            age: faker.datatype.number({ min: 18, max: 80 }),
            password: "123456", 
            role: "user",
            pets: [],
        };
        const userCreated = await UserManager.createUser(randomUser);
        return res.status(201).json(userCreated);
    } catch (error) {
        return res.status(500).json({
            error: "Error creando usuario de mock",
            details: error.message,
        });
    }
};

const renderUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserManager.getUserById(userId);
        if (!user)
            return res
                .status(404)
                .render("error", { error: "Usuario no encontrado" });
        return res.render("userProfile", { user });
    } catch (error) {
        return res.status(500).render("error", { error: "Error en el servidor" });
    }
};

// (Endpoint para desarrollador: obtener todos los usuarios)
const getAllUsers = async (req, res) => {
    try {
        const users = await UserManager.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

export default {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    createMockUser,
    getAllUsers,
    renderUserProfile,
};
