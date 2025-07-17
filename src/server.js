require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Importar rotas
const authRoutes = require('./routes/authRoutes');

// Importar middlewares
const { validarJSON } = require('./middleware/validation');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar para desenvolvimento
  crossOriginEmbedderPolicy: false
}));

// Middleware CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para validar JSON
app.use(validarJSON);

// Logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API funcionando normalmente',
    timestamp: new Date().toISOString(),
    versao: '1.0.0',
    ambiente: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Login API - Sistema para Estudos de Teste de Software',
    versao: '1.0.0',
    documentacao: '/api-docs',
    endpoints: {
      login: 'POST /api/auth/login',
      recuperarSenha: 'POST /api/auth/recuperar-senha',
      verificarStatus: 'GET /api/auth/status/:email',
      resetarTentativas: 'POST /api/auth/reset-tentativas',
      verificarToken: 'GET /api/auth/verificar-token'
    },
    credenciais: {
      email: 'usuario@teste.com',
      senha: 'Senha123!',
      dataNascimento: '1990-05-15',
      nomePai: 'João Silva',
      nomeMae: 'Maria Silva'
    },
    timestamp: new Date().toISOString()
  });
});

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Login API - Documentação',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true
  }
}));

// Rotas da API
app.use('/api/auth', authRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Endpoint não encontrado',
    path: req.originalUrl,
    metodo: req.method,
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { erro: err.message })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Login API iniciada com sucesso!');
  console.log(`📡 Servidor rodando na porta: ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 URL da API: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📋 Credenciais de Teste:');
  console.log('   Email: usuario@teste.com');
  console.log('   Senha: Senha123!');
  console.log('   Data Nascimento: 1990-05-15');
  console.log('   Nome do Pai: João Silva');
  console.log('   Nome da Mãe: Maria Silva');
  console.log('');
  console.log('⚠️  Lembre-se: Esta API é para estudos de teste de software!');
});

// Tratamento de sinais para graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Recebido SIGINT. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido SIGTERM. Encerrando servidor...');
  process.exit(0);
});

module.exports = app; 