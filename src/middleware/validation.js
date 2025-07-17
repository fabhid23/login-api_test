const { MENSAGENS, STATUS } = require('../utils/constants');
const { validarEmail, validarSenha } = require('../utils/helpers');
const passwordService = require('../services/passwordService');

// Validar dados de login
const validarLogin = (req, res, next) => {
  const { email, senha } = req.body;

  // Verificar se todos os campos estão presentes
  if (!email || !senha) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.CAMPOS_OBRIGATORIOS,
      timestamp: new Date().toISOString()
    });
  }

  // Validar formato do email
  if (!validarEmail(email)) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.EMAIL_INVALIDO,
      timestamp: new Date().toISOString()
    });
  }

  // Validar senha
  if (!validarSenha(senha)) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.SENHA_INVALIDA,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Validar dados de recuperação de senha
const validarRecuperacaoSenha = (req, res, next) => {
  const { email, dataNascimento, nomePai, nomeMae } = req.body;

  // Verificar se todos os campos estão presentes
  if (!email || !dataNascimento || !nomePai || !nomeMae) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.CAMPOS_OBRIGATORIOS,
      timestamp: new Date().toISOString()
    });
  }

  // Validar formato do email
  if (!validarEmail(email)) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.EMAIL_INVALIDO,
      timestamp: new Date().toISOString()
    });
  }

  // Validar dados de recuperação
  const validacao = passwordService.validarDadosRecuperacaoPublico(
    dataNascimento, 
    nomePai, 
    nomeMae
  );

  if (!validacao.valido) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: validacao.mensagem,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Validar email para reset de tentativas
const validarEmailReset = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: 'Email é obrigatório',
      timestamp: new Date().toISOString()
    });
  }

  if (!validarEmail(email)) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.EMAIL_INVALIDO,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Validar parâmetro email na URL
const validarEmailParam = (req, res, next) => {
  const { email } = req.params;

  if (!email) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: 'Email é obrigatório',
      timestamp: new Date().toISOString()
    });
  }

  if (!validarEmail(email)) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: MENSAGENS.EMAIL_INVALIDO,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Middleware para validar JSON
const validarJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(STATUS.BAD_REQUEST).json({
      sucesso: false,
      mensagem: 'JSON inválido',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

module.exports = {
  validarLogin,
  validarRecuperacaoSenha,
  validarEmailReset,
  validarEmailParam,
  validarJSON
}; 