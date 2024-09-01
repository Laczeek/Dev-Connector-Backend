class AppError extends Error {
	isOperational = true;

	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		
	}
}

export default AppError;
