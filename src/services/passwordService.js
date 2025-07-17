const { MENSAGENS, STATUS, CONFIG_SEGURANCA } = require('../utils/constants');
const { 
  validarDataNascimento, 
  gerarSenhaTemporaria, 
  criptografarSenha 
} = require('../utils/helpers');
const authService = require('./authService');
const emailService = require('./emailService');

class PasswordService {
  // Recuperar senha
  async recuperarSenha(email, dataNascimento, nomePai, nomeMae) {
    try {
      // Obter dados do usuário
      const usuario = authService.obterUsuario(email);
      
      if (!usuario) {
        return {
          sucesso: false,
          mensagem: MENSAGENS.EMAIL_NAO_ENCONTRADO,
          status: STATUS.NOT_FOUND
        };
      }

      // Validar dados de recuperação
      const dadosValidos = this.validarDadosRecuperacao(
        usuario, 
        dataNascimento, 
        nomePai, 
        nomeMae
      );

      if (!dadosValidos) {
        return {
          sucesso: false,
          mensagem: MENSAGENS.DADOS_RECUPERACAO_INVALIDOS,
          status: STATUS.UNAUTHORIZED
        };
      }

      // Gerar nova senha temporária
      const novaSenha = gerarSenhaTemporaria(CONFIG_SEGURANCA.SENHA_TEMPORARIA_LENGTH);
      
      // Criptografar nova senha
      const novaSenhaHash = await criptografarSenha(novaSenha);
      
      // Atualizar senha no sistema
      const senhaAtualizada = authService.atualizarSenha(email, novaSenhaHash);
      
      if (!senhaAtualizada) {
        return {
          sucesso: false,
          mensagem: 'Erro ao atualizar senha',
          status: STATUS.INTERNAL_SERVER_ERROR
        };
      }

      // Enviar email com nova senha
      const emailEnviado = await emailService.enviarSenhaTemporaria(
        email, 
        novaSenha
      );

      if (!emailEnviado) {
        return {
          sucesso: false,
          mensagem: 'Erro ao enviar email',
          status: STATUS.INTERNAL_SERVER_ERROR
        };
      }

      return {
        sucesso: true,
        mensagem: MENSAGENS.SENHA_RECUPERADA,
        dados: {
          email,
          novaSenhaEnviada: true
        },
        status: STATUS.SUCESSO
      };

    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return {
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        status: STATUS.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Validar dados de recuperação
  validarDadosRecuperacao(usuario, dataNascimento, nomePai, nomeMae) {
    // Verificar se todos os campos estão presentes
    if (!dataNascimento || !nomePai || !nomeMae) {
      return false;
    }

    // Validar formato da data de nascimento
    if (!validarDataNascimento(dataNascimento)) {
      return false;
    }

    // Verificar se os dados correspondem aos do usuário
    const dataCorresponde = usuario.dataNascimento === dataNascimento;
    const paiCorresponde = usuario.nomePai.toLowerCase() === nomePai.toLowerCase();
    const maeCorresponde = usuario.nomeMae.toLowerCase() === nomeMae.toLowerCase();

    return dataCorresponde && paiCorresponde && maeCorresponde;
  }

  // Validar dados de recuperação (versão pública para middleware)
  validarDadosRecuperacaoPublico(dataNascimento, nomePai, nomeMae) {
    // Verificar se todos os campos estão presentes
    if (!dataNascimento || !nomePai || !nomeMae) {
      return {
        valido: false,
        mensagem: MENSAGENS.CAMPOS_OBRIGATORIOS
      };
    }

    // Validar formato da data de nascimento
    if (!validarDataNascimento(dataNascimento)) {
      return {
        valido: false,
        mensagem: MENSAGENS.DATA_INVALIDA
      };
    }

    return {
      valido: true,
      mensagem: 'Dados válidos'
    };
  }
}

module.exports = new PasswordService(); 