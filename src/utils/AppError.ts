class AppError extends Error {
	isOperational = true;
	statusCode: number;
	field?: string;

	constructor(message: string, statusCode: number, field?: string) {
		super(message);
		this.statusCode = statusCode;
		if(field) {
			this.field = field;
		}
	}
}

export default AppError;
