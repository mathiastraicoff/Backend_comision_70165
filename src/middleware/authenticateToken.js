import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    logger.info(`Token recibido en la solicitud: ${token}`);

    if (!token) {
        logger.error("Token no encontrado");
        return res.status(401).json({
            error: "Token no encontrado. Acceso no autorizado.",
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.error(`Error al verificar el token: ${err.message}`);
            return res.status(403).json({
                error: "Token inválido o expirado. Acceso no autorizado.",
            });
        }
        logger.info(`Token válido, datos del usuario: ${JSON.stringify(decoded)}`);
        req.user = { id: decoded.id, email: decoded.email };
        next();
    });
};

export default authenticateToken;
