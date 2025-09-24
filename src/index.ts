import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use(cors());


app.use('/api', routes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
