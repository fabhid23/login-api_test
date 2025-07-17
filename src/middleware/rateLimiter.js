const rateLimit = require('express-rate-limit');

// Rate limiter para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    sucesso: false,
    mensagem: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      sucesso: false,
      mensagem: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
      timestamp: new Date().toISOString()
    });
  }
});

// Rate limiter para recuperação de senha
const recuperacaoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas por IP
  message: {
    sucesso: false,
    mensagem: 'Muitas tentativas de recuperação de senha. Tente novamente em 1 hora.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      sucesso: false,
      mensagem: 'Muitas tentativas de recuperação de senha. Tente novamente em 1 hora.',
      timestamp: new Date().toISOString()
    });
  }
});

// Rate limiter geral para a API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: {
    sucesso: false,
    mensagem: 'Muitas requisições. Tente novamente em 15 minutos.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      sucesso: false,
      mensagem: 'Muitas requisições. Tente novamente em 15 minutos.',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = {
  loginLimiter,
  recuperacaoLimiter,
  apiLimiter
}; 