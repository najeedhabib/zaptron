import express from 'express';
import dotenv from 'dotenv';
import leadsRoutes from './routes/routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/', leadsRoutes);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Something went wrong!' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
