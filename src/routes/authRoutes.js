const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const passwordController = require('../controllers/passwordController');

// Middlewares
const { 
  validarLogin, 
  validarRecuperacaoSenha, 
  validarEmailReset, 
  validarEmailParam 
} = require('../middleware/validation');
const { verificarTokenJWT } = require('../middleware/auth');
const { 
  loginLimiter, 
  recuperacaoLimiter, 
  apiLimiter 
} = require('../middleware/rateLimiter');

// Aplicar rate limiter geral a todas as rotas
router.use(apiLimiter);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@teste.com
 *               senha:
 *                 type: string
 *                 minLength: 8
 *                 example: Senha123!
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                         ultimoLogin:
 *                           type: string
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Conta bloqueada
 *       429:
 *         description: Muitas tentativas
 */
router.post('/login', loginLimiter, validarLogin, authController.login);

/**
 * @swagger
 * /api/auth/recuperar-senha:
 *   post:
 *     summary: Recuperar senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - dataNascimento
 *               - nomePai
 *               - nomeMae
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@teste.com
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               nomePai:
 *                 type: string
 *                 example: João Silva
 *               nomeMae:
 *                 type: string
 *                 example: Maria Silva
 *     responses:
 *       200:
 *         description: Senha recuperada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Dados de recuperação inválidos
 *       404:
 *         description: Email não encontrado
 *       429:
 *         description: Muitas tentativas
 */
router.post('/recuperar-senha', recuperacaoLimiter, validarRecuperacaoSenha, passwordController.recuperarSenha);

/**
 * @swagger
 * /api/auth/status/{email}:
 *   get:
 *     summary: Verificar status da conta
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: usuario@teste.com
 *     responses:
 *       200:
 *         description: Status da conta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 dados:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     tentativas:
 *                       type: number
 *                     bloqueada:
 *                       type: boolean
 *                     bloqueadoAte:
 *                       type: string
 *                     ultimaTentativa:
 *                       type: string
 *       404:
 *         description: Email não encontrado
 */
router.get('/status/:email', validarEmailParam, authController.verificarStatus);

/**
 * @swagger
 * /api/auth/reset-tentativas:
 *   post:
 *     summary: Resetar tentativas de login (para testes)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@teste.com
 *     responses:
 *       200:
 *         description: Tentativas resetadas
 *       404:
 *         description: Email não encontrado
 */
router.post('/reset-tentativas', validarEmailReset, authController.resetarTentativas);

/**
 * @swagger
 * /api/auth/verificar-token:
 *   get:
 *     summary: Verificar token de autenticação
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 dados:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                     autenticado:
 *                       type: boolean
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.get('/verificar-token', verificarTokenJWT, authController.verificarToken);

module.exports = router; 