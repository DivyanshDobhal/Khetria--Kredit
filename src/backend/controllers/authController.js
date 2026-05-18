import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { getMessage } from '../utils/i18n.js';

const prisma = new PrismaClient();

// Register a new user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: getMessage('user.already.exists', req.language) 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        loginCount: 0, // Initialize login count
        isActive: true, // Account is active by default
        emailVerified: false // Email verification pending
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        creditScore: true,
        trustScore: true,
        createdAt: true,
        isActive: true,
        emailVerified: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: getMessage('user.registered.successfully', req.language),
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: getMessage('server.error', req.language) 
    });
  }
};

// Helper function to get client IP address
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'unknown';
};

// Helper function to get user agent
const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

// Login user
const login = async (req, res) => {
  const ipAddress = getClientIp(req);
  const userAgent = getUserAgent(req);
  const loginTime = new Date();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Log failed login attempt - user not found
      await prisma.loginHistory.create({
        data: {
          userId: '000000000000000000000000', // Dummy ObjectId for non-existent user
          email,
          success: false,
          ipAddress,
          userAgent,
          failureReason: 'User not found'
        }
      });

      return res.status(400).json({ 
        message: getMessage('invalid.credentials', req.language) 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          email,
          success: false,
          ipAddress,
          userAgent,
          failureReason: 'Account is inactive'
        }
      });

      return res.status(403).json({ 
        message: 'Your account has been deactivated. Please contact support.' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login attempt - wrong password
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          email,
          success: false,
          ipAddress,
          userAgent,
          failureReason: 'Invalid password'
        }
      });

      return res.status(400).json({ 
        message: getMessage('invalid.credentials', req.language) 
      });
    }

    // Successful login - update user login info and create login history
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: loginTime,
        loginCount: {
          increment: 1
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        creditScore: true,
        trustScore: true,
        lastLogin: true,
        loginCount: true,
        createdAt: true
      }
    });

    // Log successful login
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email,
        success: true,
        ipAddress,
        userAgent
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: getMessage('login.successful', req.language),
      token,
      user: updatedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Try to log the error in login history if we have email
    try {
      if (req.body.email) {
        await prisma.loginHistory.create({
          data: {
            userId: '000000000000000000000000',
            email: req.body.email,
            success: false,
            ipAddress,
            userAgent,
            failureReason: `Server error: ${error.message}`
          }
        });
      }
    } catch (logError) {
      console.error('Failed to log login history:', logError);
    }

    res.status(500).json({ 
      message: getMessage('server.error', req.language) 
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        creditScore: true,
        trustScore: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      message: getMessage('server.error', req.language) 
    });
  }
};

// Switch user role for demo/testing flows
const switchRole = async (req, res) => {
  try {
    const newRole = req.user.role === 'BORROWER' ? 'LENDER' : 'BORROWER';

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        creditScore: true,
        trustScore: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: `Switched to ${newRole}`,
      token,
      user
    });
  } catch (error) {
    console.error('Switch role error:', error);
    res.status(500).json({
      message: getMessage('server.error', req.language)
    });
  }
};

export {
  register,
  login,
  getCurrentUser,
  switchRole
};
