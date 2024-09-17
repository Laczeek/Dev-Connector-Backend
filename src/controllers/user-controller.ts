import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

import User from '../models/User';
import { createToken } from '../utils/jwt-promise';
import { storeImage } from '../utils/handle-images';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password, passwordConfirm } = req.body;

		if (!req.file) throw new AppError('Please provide your avatar image.', 400, 'avatar');

		if (passwordConfirm !== password) throw new AppError('Passwords must be the same.', 400, 'password');
		

		const filePaths = await storeImage(req.file.buffer, name, 300, 300);
		
		req.deleteFilePath = filePaths[1];
		const user = await User.create({ name, email, password, avatar: filePaths[0], deleteAvatar: filePaths[1] });

		const payload = { _id: user.id };
		const jwt = await createToken(payload);

		res.status(201).json({ jwt, user: { _id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
	} catch (err) {
		next(err);
	}
};

export default {
	registerUser,
};
