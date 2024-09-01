/// <reference path="../types/index.d.ts" />
import { NextFunction, Request, Response } from 'express';

import User from '../models/User';
import AppError from '../utils/AppError';
import validateLogin from '../utils/validate-login';
import { createToken } from '../utils/jwt-promise';

const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user!._id);

		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password }: { email: string; password: string } = req.body;

		const errors = validateLogin(email, password);
		if (errors.length > 0) return res.status(400).json({ errors });

		const user = await User.findOne({ email }).select('+password');
		if (!user)
			return res.status(400).json({ errors: [{ field: 'email', error: 'User with provided email does not exist.' }] });

        const arePasswordsSame = await user.comparePasswords(password);
        if(!arePasswordsSame) return res.status(401).json({errors: [{field: 'password', error: 'Incorrect password.'}]})

		const payload = { _id: user.id };
		const jwt = await createToken(payload);

		res.status(200).json({ jwt });
	} catch (err) {
		next(err);
	}
};

export default {
	getAuthenticatedUser,
	login,
};
