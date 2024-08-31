import express from 'express';

const PORT = process.env.PORT || 8080;

const app = express();

app.use((req, res, next) => {
	res.send('Hello!');
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT} port.`);
});

process.on('uncaughtException', err => {
	console.error('Error occured 💥.');
	console.error(err);
	process.exit(1);
});
