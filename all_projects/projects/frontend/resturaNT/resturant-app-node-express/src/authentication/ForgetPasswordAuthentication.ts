import jwt from 'jsonwebtoken';
import config from '../config/config';

const JWT_SECRET_KEY = String(config.JWT_SECRET_KEY);

function forgetPasswordAuthToken(forgetPasswordToken: string, userEmail: string) {
    const token = jwt.sign({
        user: {
            forgetPasswordToken,
            email: userEmail
        }
    }, JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

function checkForgetPasswordAuth(forgetPasswordAuthTkn: string): any {
    let data = null;
    jwt.verify(forgetPasswordAuthTkn, JWT_SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
            data = null;
        } else {
            data = decoded.user;
        }
    });
    return data;
}

export default { forgetPasswordAuthToken, checkForgetPasswordAuth, JWT_SECRET_KEY };
