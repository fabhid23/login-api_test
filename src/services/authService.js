const { USUARIO_TESTE, CONFIG_SEGURANCA, MENSAGENS, STATUS } = require('../utils/constants');
const { 
  verificarSenha, 
  gerarToken, 
  verificarBloqueio, 
  formatarErro, 
  formatarSucesso 
} = require('../utils/helpers');

// Clonar usuário para evitar modificações no original
let usuarioAtual = JSON.parse(JSON.stringify(USUARIO_TESTE));

class AuthService {
  // Realizar login
  async realizarLogin(email, senha) {
    try {
      // Verificar se o email existe
      if (email !== usuarioAtual.email) {
        return {
          sucesso: false,
          mensagem: MENSAGENS.CREDENCIAIS_INVALIDAS,
          status: STATUS.UNAUTHORIZED
        };
      }

      // Verificar se a conta está bloqueada
      if (verificarBloqueio(usuarioAtual)) {
        return {
          sucesso: false,
          mensagem: MENSAGENS.CONTA_BLOQUEADA,
          status: STATUS.FORBIDDEN
        };
      }

      // Verificar senha
      const senhaValida = await verificarSenha(senha, usuarioAtual.senha);
      
      if (!senhaValida) {
        // Incrementar tentativas
        usuarioAtual.tentativas += 1;
        usuarioAtual.ultimaTentativa = new Date().toISOString();

        // Verificar se deve bloquear a conta
        if (usuarioAtual.tentativas >= CONFIG_SEGURANCA.MAX_TENTATIVAS) {
          const bloqueioAte = new Date();
          bloqueioAte.setMinutes(bloqueioAte.getMinutes() + CONFIG_SEGURANCA.TEMPO_BLOQUEIO_MINUTOS);
          usuarioAtual.bloqueadoAte = bloqueioAte.toISOString();

          return {
            sucesso: false,
            mensagem: MENSAGENS.CONTA_BLOQUEADA,
            status: STATUS.FORBIDDEN
          };
        }

        return {
          sucesso: false,
          mensagem: MENSAGENS.CREDENCIAIS_INVALIDAS,
          status: STATUS.UNAUTHORIZED
        };
      }

      // Login bem-sucedido - resetar tentativas
      usuarioAtual.tentativas = 0;
      usuarioAtual.bloqueadoAte = null;
      usuarioAtual.ultimaTentativa = new Date().toISOString();

      // Gerar token
      const token = gerarToken({ 
        email: usuarioAtual.email,
        timestamp: new Date().toISOString()
      });

      return {
        sucesso: true,
        mensagem: MENSAGENS.LOGIN_SUCESSO,
        dados: {
          token,
          usuario: {
            email: usuarioAtual.email,
            ultimoLogin: new Date().toISOString()
          }
        },
        status: STATUS.SUCESSO
      };

    } catch (error) {
      console.error('Erro no login:', error);
      return {
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        status: STATUS.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Verificar status da conta
  verificarStatus(email) {
    if (email !== usuarioAtual.email) {
      return {
        sucesso: false,
        mensagem: MENSAGENS.EMAIL_NAO_ENCONTRADO,
        status: STATUS.NOT_FOUND
      };
    }

    const estaBloqueada = verificarBloqueio(usuarioAtual);
    
    return {
      sucesso: true,
      dados: {
        email: usuarioAtual.email,
        tentativas: usuarioAtual.tentativas,
        bloqueada: estaBloqueada,
        bloqueadoAte: usuarioAtual.bloqueadoAte,
        ultimaTentativa: usuarioAtual.ultimaTentativa
      },
      status: STATUS.SUCESSO
    };
  }

  // Resetar tentativas (para testes)
  resetarTentativas(email) {
    if (email !== usuarioAtual.email) {
      return {
        sucesso: false,
        mensagem: MENSAGENS.EMAIL_NAO_ENCONTRADO,
        status: STATUS.NOT_FOUND
      };
    }

    usuarioAtual.tentativas = 0;
    usuarioAtual.bloqueadoAte = null;
    usuarioAtual.ultimaTentativa = null;

    return {
      sucesso: true,
      mensagem: MENSAGENS.TENTATIVAS_RESETADAS,
      status: STATUS.SUCESSO
    };
  }

  // Obter dados do usuário (para recuperação de senha)
  obterUsuario(email) {
    if (email !== usuarioAtual.email) {
      return null;
    }
    return usuarioAtual;
  }

  // Atualizar senha do usuário
  atualizarSenha(email, novaSenhaHash) {
    if (email !== usuarioAtual.email) {
      return false;
    }
    
    usuarioAtual.senha = novaSenhaHash;
    return true;
  }
}

module.exports = new AuthService(); 