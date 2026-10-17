import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { i18nMiddleware } from './utils/i18n.js';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(i18nMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    res.json({
      status: 'OK',
      database: 'connected',
      message: 'Micro-lending platform API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error.code || error.name);
    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      message: 'Micro-lending platform API is running, but the database is unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`💰 Loan endpoints: http://localhost:${PORT}/api/loans`);
    console.log(`📈 Dashboard endpoints: http://localhost:${PORT}/api/dashboard`);
    console.log('✅ Micro-lending platform ready!');
  });
}

export default app;
