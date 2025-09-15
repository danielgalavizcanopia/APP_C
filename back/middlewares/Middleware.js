const jwt = require('jsonwebtoken');

// Middleware para autenticar usuarios
const authMiddleware = (req, res, next) => {
    // Verificar si se proporciona un token de autenticación en el encabezado de la solicitud
    const token = req.header('Authorization').split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere un token de autenticación.' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token de autenticación no válido.' });
    }
};


module.exports = authMiddleware;