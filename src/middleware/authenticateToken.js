import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Token recibido en la solicitud:", token);

    if (!token) {
        console.log("Token no encontrado");
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error al verificar el token:", err.message);
            return res.redirect('/login');
        }
        console.log("Token válido, usuario:", user);
        req.user = user; 
        next();
    });
};

export default authenticateToken;
