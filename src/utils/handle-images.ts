import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import AppError from './AppError';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	if (!file || file.mimetype.split('/')[0] !== 'image') {
		return cb(new AppError('Wrong type of file. Only image allowed.', 400));
	}

	cb(null, true);
};

const storage = multer.memoryStorage();
export const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 4 } });

export const storeImage = async (buffer: Buffer, fileName: string, folder: string, width: number, height: number) => {
	const uniqueFileName = `${fileName}-${uuid()}.jpeg`;

	const filePath = path.join(__dirname, '..', '..', 'public', 'images', folder, uniqueFileName);
	await sharp(buffer).resize(width, height).jpeg({ mozjpeg: true }).toFile(filePath);

	return `images/${folder}/${uniqueFileName}`;
};

export const removeImage = async (filePath: string) => {
	const fullFilePath = path.join(__dirname, '..', '..', 'public', filePath);
	await fs.unlink(fullFilePath);
};
