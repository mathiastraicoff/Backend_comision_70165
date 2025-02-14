import request from "supertest";
import { server } from "../../app.js";
import mongoose from "mongoose";
import { expect } from "chai";
import UserService from "../../service/UserManager.js";

describe("Session Router - Unit tests", () => {
    let token = "";
    let userId = "";

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/mi_base_de_datos");
        }

        await mongoose.connection.collection('users').deleteOne({ email: "juanperez@example.com" });

        const user = await UserService.createUser({
            first_name: "Juan",
            last_name: "Perez",
            email: "juanperez@example.com",
            phone: "123456789",
            age: 30,
            password: "coder123",
            role: "user",
        });
        userId = user._id;

        const loginResponse = await request(server)
            .post("/auth/login")
            .send({ email: "juanperez@example.com", password: "coder123" });
        token = loginResponse.body.token;
    });

    after(async () => {
        await mongoose.connection.collection('users').deleteOne({ email: "juanperez@example.com" });
        await mongoose.connection.close();
        server.close();
    });

    it("Debe responder con 200 en la ruta principal", async () => {
        const response = await request(server).get("/");
        expect(response.statusCode).to.equal(200);
    });

    it("Debe manejar rutas inexistentes con 404", async () => {
        const response = await request(server).get("/ruta-inexistente");
        expect(response.statusCode).to.equal(404);
    });

    it("Debe rechazar la sesión sin autenticación", async () => {
        const response = await request(server).get("/api/sessions/current");
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.have.property("error", "Token no encontrado. Acceso no autorizado.");
    });

    it("Debe cerrar sesión correctamente", async () => {
        const response = await request(server)
            .post("/api/sessions/logout")
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
    });
});
