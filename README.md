# Login API

API REST para Login desenvolvida em JavaScript com Express, focada em estudos de teste de software.

## Funcionalidades

- ✅ Login com sucesso
- ✅ Login inválido
- ✅ Bloqueio de senha após 3 tentativas
- ✅ Recuperação de senha (esqueci a senha)
- ✅ Documentação Swagger

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **nodemailer** - Envio de emails
- **swagger-ui-express** - Documentação da API
- **express-rate-limit** - Limitação de tentativas

## Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em produção
npm start
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

## Endpoints da API

### Base URL
```
http://localhost:3000
```

### Documentação Swagger
```
http://localhost:3000/api-docs
```

## Credenciais de Teste

### Usuário Válido
```json
{
  "email": "usuario@teste.com",
  "senha": "Senha123!"
}
```

### Dados para Recuperação de Senha
```json
{
  "email": "usuario@teste.com",
  "dataNascimento": "1990-05-15",
  "nomePai": "João Silva",
  "nomeMae": "Maria Silva"
}
```

## Endpoints

### 1. Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "usuario@teste.com",
  "senha": "Senha123!"
}
```

### 2. Recuperação de Senha
- **POST** `/api/auth/recuperar-senha`
- **Body:**
```json
{
  "email": "usuario@teste.com",
  "dataNascimento": "1990-05-15",
  "nomePai": "João Silva",
  "nomeMae": "Maria Silva"
}
```

### 3. Verificar Status da Conta
- **GET** `/api/auth/status/:email`

### 4. Resetar Tentativas (para testes)
- **POST** `/api/auth/reset-tentativas`
- **Body:**
```json
{
  "email": "usuario@teste.com"
}
```

## Funcionalidades de Segurança

### Bloqueio por Tentativas
- Após 3 tentativas de login inválidas, a conta é bloqueada por 15 minutos
- O sistema mantém registro das tentativas em memória
- Endpoint para resetar tentativas disponível para testes

### Validações
- Email deve ter formato válido
- Senha deve ter pelo menos 8 caracteres
- Data de nascimento deve ser válida
- Todos os campos obrigatórios devem ser preenchidos

## Estrutura do Projeto

```
login-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── passwordController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── validation.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── emailService.js
│   │   └── passwordService.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── config/
│   │   └── swagger.js
│   └── server.js
├── package.json
├── .env.example
└── README.md
```

## Testes

```bash
# Executar testes
npm test
```

## Observações Importantes

- **Dados em Memória**: Todas as informações são armazenadas em memória (variáveis/constantes)
- **Ambiente de Estudo**: Esta API é destinada exclusivamente para estudos de teste de software
- **Não Produção**: Não deve ser utilizada em ambiente de produção
- **Swagger**: Documentação completa disponível em `/api-docs`

## Status da API

- ✅ Login funcional
- ✅ Bloqueio por tentativas
- ✅ Recuperação de senha
- ✅ Documentação Swagger
- ✅ Validações de entrada
- ✅ Rate limiting
- ✅ Middleware de segurança 