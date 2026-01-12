import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/prisma';
import './config/redis';
import './config/passport';
import routes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/internal/auth', routes);

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[Auth Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

start();