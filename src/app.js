import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";
import logger from "./utils/logger.js";
import merge from "lodash.merge";

import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import authRouter from "./routes/auth.router.js";
import purchaseRouter from "./routes/purchase.router.js";
import proxyRouter from "./routes/proxy.router.js";
import mocksRouter from "./routes/mocks.router.js";
import ipinfoRouter from "./routes/ipinfo.router.js";
import usersRouter from "./routes/users.router.js";

import {
    configureLocalStrategy,
    configureJwtStrategy,
} from "./config/passport.js";
import errorHandler from "./middleware/errorHandler.js";
import authenticateToken from "./middleware/authenticateToken.js";

import swaggerInfo from "./docs/info.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(
		helmet({
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					"default-src": ["'self'"],
					"script-src": [
						"'self'",
						"https://cdnjs.cloudflare.com",
						"https://gc.kis.v2.scr.kaspersky-labs.com",
					],
					"style-src": [
						"'self'",
						"'unsafe-inline'",
						"https://cdnjs.cloudflare.com",
					],
					"img-src": ["'self'", "data:", "https://cdnjs.cloudflare.com"],
					"connect-src": [
						"'self'",
						"https://cdnjs.cloudflare.com",
						"https://gc.kis.v2.scr.kaspersky-labs.com",
						process.env.CLIENT_URL,
					],
				},
				reportOnly: false,
			},
		}),
	);
	app.disable("x-powered-by");


app.use(cors(corsOptions));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => logger.info("✅ Conexión a MongoDB exitosa"))
    .catch((error) => logger.error(`❌ Error al conectar a MongoDB: ${error}`));

app.engine(
    "handlebars",
    engine({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        layoutsDir: path.join(__dirname, "views/layouts"),
        defaultLayout: "main",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 14 * 24 * 60 * 60,
        }),
        secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "strict",
        },
    }),
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

configureLocalStrategy(passport);
configureJwtStrategy(passport);

// Rutas de autenticación y sesiones primero
app.use("/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/ipinfo", ipinfoRouter);
app.use("/", viewsRouter);

// Rutas protegidas
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/carts", authenticateToken, cartsRouter);
app.use("/api/products", authenticateToken, productsRouter);
app.use("/api/purchases", authenticateToken, purchaseRouter);
app.use("/api/mocks", authenticateToken, mocksRouter);
app.use("/api", authenticateToken, proxyRouter);

io.on("connection", (socket) => {
    logger.info(`🔌 Usuario conectado: ${socket.id}`);
    socket.on("disconnect", () => {
        logger.info(`❌ Usuario desconectado: ${socket.id}`);
    });
});

app.use(express.static(path.join(__dirname, "public")));

app.use(errorHandler);

// Cargar y fusionar la documentación Swagger
const info = swaggerInfo;
const paths = yaml.load(
    fs.readFileSync(path.join(__dirname, "docs", "paths.yml"), "utf8"),
);
const requests = yaml.load(
    fs.readFileSync(path.join(__dirname, "docs/requests.yml"), "utf8"),
);
const responses = yaml.load(
    fs.readFileSync(path.join(__dirname, "docs/responses.yml"), "utf8"),
);

// Forzamos que exista "components" para evitar errores
const swaggerSpec = merge(
    {},
    { components: {} },
    info,
    { paths },
    requests,
    responses,
);

// Servir la documentación Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 8080;

server.listen(PORT, "0.0.0.0" , () => {
    logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

