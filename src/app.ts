import express from 'express';
import mongoose from 'mongoose';

import errorMiddleware from './middlewares/error-middleware';
import userRouter from './routers/user-router';
import authRouter from './routers/auth-router';

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL!;

mongoose.connect(MONGO_URL);
const app = express();

app.use(express.json());
// routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// error middleware
app.use(errorMiddleware);

mongoose.connection.on('open', () => {
	console.log('Connection with mongo server established.');
	app.listen(PORT, () => {
		console.log(`Server listening on ${PORT} port.`);
	});
});
process.on('uncaughtException', err => {
	console.error('Error occured 💥.');
	console.error(err);
	process.exit(1);
});
