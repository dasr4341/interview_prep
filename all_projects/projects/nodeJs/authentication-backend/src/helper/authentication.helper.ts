import crypto from 'crypto';
import { config } from '../config/config.js';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => crypto.createHmac('sha256', [salt, password].join('/')).update(config.secret).digest('hex');
