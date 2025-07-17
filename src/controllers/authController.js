const authService = require('../services/authService');
const { STATUS } = require('../utils/constants');

class AuthController {
  // Realizar login
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      
      const resultado = await authService.realizarLogin(email, senha);
      
      return res.status(resultado.status).json({
        sucesso: resultado.sucesso,
        mensagem: resultado.mensagem,
        dados: resultado.dados,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro no controller de login:', error);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Verificar status da conta
  async verificarStatus(req, res) {
    try {
      const { email } = req.params;
      
      const resultado = authService.verificarStatus(email);
      
      return res.status(resultado.status).json({
        sucesso: resultado.sucesso,
        mensagem: resultado.mensagem,
        dados: resultado.dados,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Resetar tentativas (para testes)
  async resetarTentativas(req, res) {
    try {
      const { email } = req.body;
      
      const resultado = authService.resetarTentativas(email);
      
      return res.status(resultado.status).json({
        sucesso: resultado.sucesso,
        mensagem: resultado.mensagem,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro ao resetar tentativas:', error);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Verificar token (endpoint protegido)
  async verificarToken(req, res) {
    try {
      return res.status(STATUS.SUCESSO).json({
        sucesso: true,
        mensagem: 'Token válido',
        dados: {
          usuario: req.usuario,
          autenticado: true
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new AuthController(); 