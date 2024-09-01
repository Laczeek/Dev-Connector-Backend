import { NextFunction, Request, Response } from 'express';
import gravatar from 'gravatar';

import User from '../models/User';
import { createToken } from '../utils/jwt-promise';

const registerUser  = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const { name, email, password } = req.body;

		const avatar = gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm',
		});

		const user = await User.create({ name, email, password, avatar });

		const payload = { _id: user.id };

		const jwt = await createToken(payload);

		res.status(201).json({ jwt });
	} catch (err) {
		next(err);
	}
}

export default {
    registerUser
}