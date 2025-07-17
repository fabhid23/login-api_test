// Dados do usuário em memória
const USUARIO_TESTE = {
  email: 'usuario@teste.com',
  senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Senha123!
  dataNascimento: '1990-05-15',
  nomePai: 'João Silva',
  nomeMae: 'Maria Silva',
  tentativas: 0,
  bloqueadoAte: null,
  ultimaTentativa: null
};

// Configurações de segurança
const CONFIG_SEGURANCA = {
  MAX_TENTATIVAS: 3,
  TEMPO_BLOQUEIO_MINUTOS: 15,
  JWT_EXPIRACAO: '1h',
  SENHA_TEMPORARIA_LENGTH: 8
};

// Mensagens de erro
const MENSAGENS = {
  LOGIN_SUCESSO: 'Login realizado com sucesso',
  CREDENCIAIS_INVALIDAS: 'Email ou senha inválidos',
  CONTA_BLOQUEADA: 'Conta bloqueada devido a múltiplas tentativas. Tente novamente em 15 minutos',
  EMAIL_NAO_ENCONTRADO: 'Email não encontrado',
  DADOS_RECUPERACAO_INVALIDOS: 'Dados de recuperação inválidos',
  SENHA_RECUPERADA: 'Nova senha enviada para o email',
  TENTATIVAS_RESETADAS: 'Tentativas resetadas com sucesso',
  EMAIL_INVALIDO: 'Formato de email inválido',
  SENHA_INVALIDA: 'Senha deve ter pelo menos 8 caracteres',
  DATA_INVALIDA: 'Data de nascimento inválida',
  CAMPOS_OBRIGATORIOS: 'Todos os campos são obrigatórios'
};

// Status de resposta
const STATUS = {
  SUCESSO: 200,
  CRIADO: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  USUARIO_TESTE,
  CONFIG_SEGURANCA,
  MENSAGENS,
  STATUS
}; 