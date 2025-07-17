const passwordService = require('../services/passwordService');
const { STATUS } = require('../utils/constants');

class PasswordController {
  // Recuperar senha
  async recuperarSenha(req, res) {
    try {
      const { email, dataNascimento, nomePai, nomeMae } = req.body;
      
      const resultado = await passwordService.recuperarSenha(
        email, 
        dataNascimento, 
        nomePai, 
        nomeMae
      );
      
      return res.status(resultado.status).json({
        sucesso: resultado.sucesso,
        mensagem: resultado.mensagem,
        dados: resultado.dados,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro no controller de recuperação de senha:', error);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new PasswordController(); 