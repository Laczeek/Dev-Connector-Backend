import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

import errorMiddleware from './middlewares/error-middleware';
import userRouter from './routers/user-router';
import authRouter from './routers/auth-router';
import profileRouter from './routers/profile-router';
import postRouter from './routers/post-router';

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL!;

mongoose.connect(MONGO_URL);
const app = express();

if (process.env.CURRENT_ENV === 'DEVELOPMENT') {
	app.use(cors());
}

app.use(express.json());
// routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/posts', postRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));

if (process.env.CURRENT_ENV === 'PRODUCTION') {
	app.get('*', (req: Request, res: Response) => {
		res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
	});
}

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

export default app;