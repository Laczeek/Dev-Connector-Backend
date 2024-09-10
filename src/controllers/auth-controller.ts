/// <reference path="../types/index.d.ts" />
import { NextFunction, Request, Response } from 'express';

import User from '../models/User';
import AppError from '../utils/AppError';
import validateLogin from '../utils/validate-login';
import { createToken } from '../utils/jwt-promise';

const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user!._id);

		res.status(200).json({user});
	} catch (err) {
		next(err);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password }: { email: string; password: string } = req.body;

		// validation errors
		const errors = validateLogin(email, password);
		if (errors.length > 0) return res.status(400).json({ errors });

		const user = await User.findOne({ email }).select('+password');
		if (!user) throw new AppError('Invalid credentials.', 400);

		const arePasswordsSame = await user.comparePasswords(password);
		if (!arePasswordsSame) throw new AppError('Invalid credentials.', 400);

		const payload = { _id: user.id };
		const jwt = await createToken(payload);

		res.status(200).json({ jwt, user: { name: user.name, _id: user.id, email: user.email, avatar: user.avatar } });
	} catch (err) {
		next(err);
	}
};

export default {
	getAuthenticatedUser,
	login,
};
