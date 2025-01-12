import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    // Obtener token desde cookies o headers
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Token recibido en la solicitud:", token);

    if (!token) {
        console.log("Token no encontrado");
        return res.status(401).json({ message: "Token no encontrado. Acceso no autorizado." });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error al verificar el token:", err.message);
            return res.status(403).json({ message: "Token inválido o expirado. Acceso no autorizado." });
        }
        console.log("Token válido, usuario:", user);
        req.user = user;  
        next();
    });
};

export default authenticateToken;
