import jwt from 'jsonwebtoken';
import AppError from './AppError';

interface IPayloadJWT {
	_id: string;
}
export interface IDecodedJWT extends IPayloadJWT {}

const SECRET_KEY = process.env.SECRET_JWT_KEY!;

export const createToken = (payload: IPayloadJWT): Promise<string> => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' }, (err, token) => {
			if (err) {
				return reject(err);
			}
			resolve(token!);
		});
	});
};

export const verifyToken = (token: string): Promise<IDecodedJWT> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
			if (err) {
				let customError: AppError;

				if (err instanceof jwt.TokenExpiredError) {
					customError = new AppError('Your authentication token has expired. Please log in again.', 401);
				} else if (err instanceof jwt.JsonWebTokenError) {
					customError = new AppError('Invalid authentication token.', 401);
				} else {
					customError = new AppError('An error occurred while verifying your authentication token.', 500);
				}

				reject(customError);
			}
			resolve(decodedToken as IDecodedJWT);
		});
	});
};
