import express from 'express';
import cors from 'cors';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Something went wrong',
    },
  });
})

export default app;
