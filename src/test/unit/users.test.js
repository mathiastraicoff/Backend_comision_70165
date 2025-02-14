import request from "supertest";
import { server } from "../../app.js";
import mongoose from "mongoose";
import { expect } from "chai";
import UserService from "../../service/UserManager.js";

describe("Users Router - Unit tests", () => {
    let token = "";
    let userId = "";
    const testEmail = "testuser@example.com";

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/mi_base_de_datos_de_prueba");
        }
        // Eliminar el usuario si existe
        await mongoose.connection
            .collection("users")
            .deleteOne({ email: testEmail });
        // Crear usuario de prueba
        const user = await UserService.createUser({
            first_name: "Test",
            last_name: "User",
            email: testEmail,
            phone: "987654321",
            age: 25,
            password: "test123",
            role: "user",
        });
        userId = user._id;
        // Iniciar sesión para obtener token
        const loginResponse = await request(server)
            .post("/auth/login")
            .send({ email: testEmail, password: "test123" });
        token = loginResponse.body.token;
    });

    after(async () => {
        await mongoose.connection
            .collection("users")
            .deleteOne({ email: testEmail });
        await mongoose.connection.close();
        server.close();
    });

    it("Debe obtener el perfil del usuario (GET /api/users/profile)", async () => {
        const response = await request(server)
            .get("/api/users/profile")
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("email", testEmail);
    });

    it("Debe actualizar el perfil del usuario (PUT /api/users/profile)", async () => {
        const newFirstName = "UpdatedTest";
        const response = await request(server)
            .put("/api/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({ first_name: newFirstName });
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("first_name", newFirstName);
    });

    it("Debe obtener la lista de todos los usuarios (GET /api/users/all)", async () => {
        const response = await request(server)
            .get("/api/users/all")
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an("array");
    });

    it("Debe eliminar el perfil del usuario (DELETE /api/users/profile)", async () => {
        const response = await request(server)
            .delete("/api/users/profile")
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        // Luego de la eliminación, intentar obtener el perfil debería dar 404
        const profileResponse = await request(server)
            .get("/api/users/profile")
            .set("Authorization", `Bearer ${token}`);
        expect(profileResponse.statusCode).to.equal(404);
    });
});
