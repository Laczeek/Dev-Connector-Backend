/// <reference path="../types/index.d.ts" />

import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import { verifyToken } from '../utils/jwt-promise';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer '))
			throw new AppError(
				'Authorization header is missing or improperly formatted. Please provide a valid Bearer token.',
				401
			);

		const userToken = authHeader.split(' ')[1];

		const decodedUserToken = await verifyToken(userToken);
		req.user = {
            _id: decodedUserToken._id
        };

		next();
	} catch (err) {
		next(err);
	}
};

export default authMiddleware;
