import jwt from 'jsonwebtoken';
import config from '../config/config';

const JWT_SECRET_KEY = String(config.JWT_SECRET_KEY);

function authToken(userId: number, userEmail: string) {
    const token = jwt.sign({
        user: {
            id: userId,
            email: userEmail
        }
    }, JWT_SECRET_KEY, { expiresIn: '1d' });
    return token;
}

export default { authToken, JWT_SECRET_KEY };
