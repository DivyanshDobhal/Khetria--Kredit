import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database client & utilities
import { prisma, checkDatabaseConnection } from './utils/prisma.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { i18nMiddleware } from './utils/i18n.js';

const app = express();

// CORS configuration
app.use(
  cors({
    origin: true, // Allow configured origins & dynamic reflection
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-language', 'Accept'],
  })
);

app.use(express.json());
app.use(i18nMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl || req.path}`);
  next();
});

// Root & API status endpoints
app.get(['/', '/api'], (req, res) => {
  res.json({
    name: 'Kshetra-Kredit API',
    status: 'healthy',
    documentation: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Routes - mounted both with and without /api prefix for local and Vercel compatibility
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/loans', '/loans'], loanRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    res.json({
      status: 'OK',
      database: 'connected',
      message: 'Kshetra-Kredit API is running and connected to MongoDB',
      latencyMs: dbStatus.latencyMs,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('Database health check failed:', dbStatus.error);
    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      message: 'Kshetra-Kredit API is running, but the database is unavailable',
      error: dbStatus.error,
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl || req.path,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
});

const PORT = process.env.PORT || 5001;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`💰 Loan endpoints: http://localhost:${PORT}/api/loans`);
    console.log(`📈 Dashboard endpoints: http://localhost:${PORT}/api/dashboard`);
    console.log('✅ Kshetra-Kredit platform ready!');
  });
}

export default app;
