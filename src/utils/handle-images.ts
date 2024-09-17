import multer, { FileFilterCallback } from 'multer';
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

export const storeImage = async (
	buffer: Buffer,
	fileName: string,
	width: number,
	height: number
): Promise<[string, string]> => {
	const uniqueFileName = `${fileName}-${uuid()}.jpeg`;

	const buff = await sharp(buffer).resize(width, height).jpeg({ mozjpeg: true }).toBuffer();
	const blob = new Blob([buff], { type: 'image/jpeg' });

	const formData = new FormData();
	formData.append('image', blob, uniqueFileName);

	const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
		method: 'POST',
		body: formData,
	});
	if (!response.ok) throw new AppError('Failed to upload the image.', 500);
	const data = await response.json();

	return [data.data.display_url, data.data.delete_url];
};

