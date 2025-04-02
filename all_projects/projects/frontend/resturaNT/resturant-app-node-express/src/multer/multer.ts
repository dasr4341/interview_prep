import multer from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
    destination(req: Request, file: any, cb: any) {
        const imgPath = path.join(__dirname, '../images');
        cb(null, imgPath);
    },
    filename(req: Request, file: any, cb: any) {
        const mimeExtension: any = {
            'image/jpeg': '.jpeg',
            'image/jpg': '.jpg',
            'image/png': '.png',
        };
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${mimeExtension[file.mimetype]}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype === 'image/jpeg'
            || file.mimetype === 'image/jpg'
            || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
            req.fileError = 'error';
        }
    }
});

export default upload;
