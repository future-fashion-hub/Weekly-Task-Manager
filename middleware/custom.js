const fs = require('fs');
const path = require('path');

const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method.padEnd(6);
  const path = req.path.padEnd(30);
  const query = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : '';
  
  console.log(`[${timestamp}] ${method} ${path} ${query}`);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    if (Object.keys(req.body).length > 0) {
      console.log('  Body:', JSON.stringify(req.body));
    }
  }
  
  next();
};

const validationMiddleware = (req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && !req.is('application/json') && Object.keys(req.body).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Content-Type должен быть application/json'
    });
  }
  next();
};

const parseBodyMiddleware = (req, res, next) => {
  if (!req.body) {
    req.body = {};
  }
  next();
};

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`  ⏱ Время обработки: ${duration}ms (${res.statusCode})`);
  });
  
  next();
};

module.exports = {
  loggingMiddleware,
  validationMiddleware,
  parseBodyMiddleware,
  corsMiddleware,
  performanceMiddleware
};
