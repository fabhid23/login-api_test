const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validar formato de email
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar senha
const validarSenha = (senha) => {
  return senha && senha.length >= 8;
};

// Validar data de nascimento
const validarDataNascimento = (data) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(data)) return false;
  
  const dataObj = new Date(data);
  const hoje = new Date();
  
  return dataObj instanceof Date && !isNaN(dataObj) && dataObj < hoje;
};

// Gerar senha temporária
const gerarSenhaTemporaria = (length = 8) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let senha = '';
  
  for (let i = 0; i < length; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  return senha;
};

// Criptografar senha
const criptografarSenha = async (senha) => {
  const saltRounds = 10;
  return await bcrypt.hash(senha, saltRounds);
};

// Verificar senha
const verificarSenha = async (senha, hash) => {
  return await bcrypt.compare(senha, hash);
};

// Gerar token JWT
const gerarToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'chave_secreta_padrao', {
    expiresIn: '1h'
  });
};

// Verificar token JWT
const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_padrao');
  } catch (error) {
    return null;
  }
};

// Verificar se conta está bloqueada
const verificarBloqueio = (usuario) => {
  if (!usuario.bloqueadoAte) return false;
  
  const agora = new Date();
  const bloqueioAte = new Date(usuario.bloqueadoAte);
  
  if (agora < bloqueioAte) {
    return true;
  } else {
    // Desbloquear se o tempo expirou
    usuario.bloqueadoAte = null;
    usuario.tentativas = 0;
    return false;
  }
};

// Calcular tempo restante de bloqueio
const calcularTempoRestante = (usuario) => {
  if (!usuario.bloqueadoAte) return 0;
  
  const agora = new Date();
  const bloqueioAte = new Date(usuario.bloqueadoAte);
  const diffMs = bloqueioAte - agora;
  
  return Math.max(0, Math.ceil(diffMs / (1000 * 60))); // Retorna minutos
};

// Formatar resposta de erro
const formatarErro = (mensagem, status = 400) => {
  return {
    sucesso: false,
    mensagem,
    timestamp: new Date().toISOString()
  };
};

// Formatar resposta de sucesso
const formatarSucesso = (dados, mensagem = 'Operação realizada com sucesso') => {
  return {
    sucesso: true,
    mensagem,
    dados,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  validarEmail,
  validarSenha,
  validarDataNascimento,
  gerarSenhaTemporaria,
  criptografarSenha,
  verificarSenha,
  gerarToken,
  verificarToken,
  verificarBloqueio,
  calcularTempoRestante,
  formatarErro,
  formatarSucesso
}; 