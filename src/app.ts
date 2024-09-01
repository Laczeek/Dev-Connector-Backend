import express from 'express';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL!;

const app = express();
mongoose.connect(MONGO_URL);

app.use((req, res, next) => {
	res.send('Hello!');
});

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
