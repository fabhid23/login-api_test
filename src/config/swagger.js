const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login API',
      version: '1.0.0',
      description: 'API REST para Login com funcionalidades de autenticação e recuperação de senha',
      contact: {
        name: 'Login API Team',
        email: 'contato@loginapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'usuario@teste.com'
            },
            senha: {
              type: 'string',
              minLength: 8,
              description: 'Senha do usuário (mínimo 8 caracteres)',
              example: 'Senha123!'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            sucesso: {
              type: 'boolean',
              example: true
            },
            mensagem: {
              type: 'string',
              example: 'Login realizado com sucesso'
            },
            dados: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'Token JWT para autenticação'
                },
                usuario: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'usuario@teste.com'
                    },
                    ultimoLogin: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-15T10:30:00.000Z'
                    }
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RecuperacaoSenhaRequest: {
          type: 'object',
          required: ['email', 'dataNascimento', 'nomePai', 'nomeMae'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'usuario@teste.com'
            },
            dataNascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento (YYYY-MM-DD)',
              example: '1990-05-15'
            },
            nomePai: {
              type: 'string',
              description: 'Nome do pai',
              example: 'João Silva'
            },
            nomeMae: {
              type: 'string',
              description: 'Nome da mãe',
              example: 'Maria Silva'
            }
          }
        },
        StatusContaResponse: {
          type: 'object',
          properties: {
            sucesso: {
              type: 'boolean',
              example: true
            },
            dados: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  example: 'usuario@teste.com'
                },
                tentativas: {
                  type: 'number',
                  description: 'Número de tentativas de login',
                  example: 0
                },
                bloqueada: {
                  type: 'boolean',
                  description: 'Se a conta está bloqueada',
                  example: false
                },
                bloqueadoAte: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data até quando a conta está bloqueada',
                  nullable: true
                },
                ultimaTentativa: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data da última tentativa de login',
                  nullable: true
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            sucesso: {
              type: 'boolean',
              example: false
            },
            mensagem: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints relacionados à autenticação e gerenciamento de senhas'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rota
};

const specs = swaggerJsdoc(options);

module.exports = specs; 