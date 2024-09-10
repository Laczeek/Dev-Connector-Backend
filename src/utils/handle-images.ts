import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

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
