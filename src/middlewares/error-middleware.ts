import { NextFunction, Request, Response } from 'express';
import { mongo, Error } from 'mongoose';

import AppError from '../utils/AppError';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err);

	// MONGO VALIDATION ERRORS
	if (err instanceof Error.ValidationError && err.name === 'ValidationError') {
		const errorsArray: { field: string; error: string }[] = [];
		const allErrors = err.errors;
		console.log(allErrors);

		Object.keys(allErrors).forEach(key =>
			errorsArray.push({ field: allErrors[key].path, error: allErrors[key].message })
		);

		return res.status(400).json({ errors: errorsArray });
	}

	// MONGO UNIQUE INDEX ERRORS
	if (err instanceof mongo.MongoServerError && err.code === 11000) {
		const indexName = Object.keys(err.keyPattern)[0];

		let errorMsg: string = `This ${indexName} is already in use.`;

		if (indexName === 'user') {
			errorMsg = 'You already have your profile.';
		}

		if (indexName !== 'email') {
			err = new AppError(errorMsg, 400);
		} else {
			err = new AppError(errorMsg, 400, 'email');
		}
	}

	// OPERATIONAL ERRORS + OPERATIONAL VALIDATION ERRORS
	if (err instanceof AppError) {
		if (err.field) {
			return res.status(err.statusCode).json({ errors: [{ field: err.field, error: err.message }] });
		}

		return res.status(err.statusCode).json({ error: err.message });
	}

	// UNHANDLED ERRORS
	res.status(500).json({ error: 'Something went wrong on the server.' });
};

export default errorMiddleware;
