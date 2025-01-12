import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { __dirname } from "./utils/utils.js";
import CartManager from "./service/CartManager.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import sessionRouter from "./routes/session.router.js";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import authRouter from "./routes/auth.router.js";
import purchaseRouter from "./routes/purchase.router.js";
import cors from "cors";
import proxyRouter from "./routes/proxy.router.js";
import mocksRouter from "./routes/mocks.router.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
import { configureLocalStrategy, configureJwtStrategy } from "./config/passport.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cartManager = new CartManager();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión a MongoDB exitosa"))
    .catch((error) => console.error("Error al conectar a MongoDB:", error));

app.engine("handlebars", engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60,
    }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true },
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());

// Estrategias de Passport
configureLocalStrategy(passport);
configureJwtStrategy(passport);

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/auth", authRouter);
app.use("/api/purchases", purchaseRouter);
app.use('/api', proxyRouter);
app.use("/api/mocks", mocksRouter);

io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado:", socket.id);

    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});

app.use(express.static(path.join(__dirname, "public")));

// Manejador de errores
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
