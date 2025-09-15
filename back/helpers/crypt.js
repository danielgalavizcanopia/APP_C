const crypto = require('crypto');

const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(process.env.JWT_SECRET)).digest('base64').substr(0, 32); // Clave de 32 bytes
const IV_LENGTH = 16; // Tamaño del vector de inicialización (IV)
const IV = Buffer.from('1234567890123456'); // IV de 16 bytes

// Función para encriptar un objeto
function encryptObject(obj) {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(JSON.stringify(obj), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Función para desencriptar un objeto
function decryptObject(encryptedText) {
    if (!encryptedText || typeof encryptedText !== 'string') {
        throw new Error('El texto encriptado no es válido o está vacío');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8'); // Asegurarse de que se recibe base64
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

module.exports = {
    encryptObject,
    decryptObject
}
