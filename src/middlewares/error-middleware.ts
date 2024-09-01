import { NextFunction, Request, Response } from 'express';
import { mongo, Error } from 'mongoose';

import AppError from '../utils/AppError';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err);

	// MONGO ERRORS
	if (err instanceof Error.ValidationError && err.name === 'ValidationError') {
		const errorsArray: { field: string; error: string }[] = [];
		const allErrors = err.errors;
		Object.keys(allErrors).forEach(key =>
			errorsArray.push({ field: allErrors[key].path, error: allErrors[key].message })
		);

        return res.status(400).json({errors: errorsArray})
	}

	if (err instanceof mongo.MongoServerError && err.code === 11000) {
		const indexName = Object.keys(err.keyPattern)[0];

        return res.status(400).json({errors: [{field: indexName, error : `This ${indexName} is already in use.`}]})
	}

	// OPERATIONAL ERRORS
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({ error: err.message });
	}

	// UNHANDLED ERRORS
	//NOTE - FOR DEVELOPMENT | CHANGE THIS BEFORE PRODUCTION
	res.status(500).json({ err });
};

export default errorMiddleware;
