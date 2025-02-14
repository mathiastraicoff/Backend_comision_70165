import request from "supertest";
import { server } from "../../app.js";
import mongoose from "mongoose";
import { expect } from "chai";

describe("App Integration Test", () => {
    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/mi_base_de_datos");
        }
    });

    after(async () => {
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

    it("Debe rechazar acceso a rutas protegidas sin token", async () => {
        const response = await request(server).get("/api/sessions/current");
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.have.property("error", "Token no encontrado. Acceso no autorizado.");
    });
});
