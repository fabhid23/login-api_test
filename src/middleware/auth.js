const { verificarToken } = require('../utils/helpers');
const { STATUS } = require('../utils/constants');

// Middleware para verificar token JWT
const verificarTokenJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(STATUS.UNAUTHORIZED).json({
      sucesso: false,
      mensagem: 'Token de acesso não fornecido',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(STATUS.UNAUTHORIZED).json({
      sucesso: false,
      mensagem: 'Token de acesso não fornecido',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return res.status(STATUS.UNAUTHORIZED).json({
        sucesso: false,
        mensagem: 'Token de acesso inválido',
        timestamp: new Date().toISOString()
      });
    }

    // Adicionar dados do usuário à requisição
    req.usuario = decoded;
    next();
    
  } catch (error) {
    return res.status(STATUS.UNAUTHORIZED).json({
      sucesso: false,
      mensagem: 'Token de acesso inválido',
      timestamp: new Date().toISOString()
    });
  }
};

// Middleware opcional para verificar token (não falha se não houver token)
const verificarTokenOpcional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return next();
  }

  try {
    const decoded = verificarToken(token);
    
    if (decoded) {
      req.usuario = decoded;
    }
    
    next();
    
  } catch (error) {
    // Se o token for inválido, apenas continua sem autenticação
    next();
  }
};

module.exports = {
  verificarTokenJWT,
  verificarTokenOpcional
}; 