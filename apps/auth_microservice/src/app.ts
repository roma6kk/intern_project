import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/prisma';
import './config/redis';
import './config/passport';
import routes from './routes/auth.routes';
import { collectDefaultMetrics } from 'prom-client';
import { metricsEndpoint, metricsMiddleware } from './utils/metrics';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

collectDefaultMetrics();

app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/metrics', metricsEndpoint);

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

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

start();