const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configurar transporter (em produção, usar variáveis de ambiente)
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER || 'teste@exemplo.com',
        pass: process.env.EMAIL_PASS || 'senha_teste'
      }
    });
  }

  // Enviar senha temporária
  async enviarSenhaTemporaria(email, novaSenha) {
    try {
      // Em ambiente de desenvolvimento/teste, apenas simular o envio
      if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
        console.log('=== EMAIL SIMULADO ===');
        console.log(`Para: ${email}`);
        console.log(`Assunto: Recuperação de Senha - Login API`);
        console.log(`Nova senha: ${novaSenha}`);
        console.log('======================');
        return true;
      }

      // Configurar email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperação de Senha - Login API',
        html: this.gerarTemplateEmail(novaSenha)
      };

      // Enviar email
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
      
      return true;

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  // Gerar template do email
  gerarTemplateEmail(novaSenha) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Recuperação de Senha</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 0 0 5px 5px;
          }
          .password-box {
            background-color: #e9ecef;
            border: 2px solid #007bff;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #6c757d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Recuperação de Senha</h1>
        </div>
        
        <div class="content">
          <p>Olá!</p>
          
          <p>Sua solicitação de recuperação de senha foi processada com sucesso.</p>
          
          <p><strong>Sua nova senha temporária é:</strong></p>
          
          <div class="password-box">
            ${novaSenha}
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
              <li>Esta é uma senha temporária</li>
              <li>Altere sua senha após fazer login</li>
              <li>Mantenha sua senha segura</li>
              <li>Esta API é para estudos de teste de software</li>
            </ul>
          </div>
          
          <p>Se você não solicitou esta recuperação, ignore este email.</p>
          
          <p>Atenciosamente,<br>
          <strong>Equipe Login API</strong></p>
        </div>
        
        <div class="footer">
          <p>Este é um email automático. Não responda a esta mensagem.</p>
          <p>Login API - Sistema para Estudos de Teste de Software</p>
        </div>
      </body>
      </html>
    `;
  }

  // Verificar se o serviço de email está configurado
  verificarConfiguracao() {
    return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
  }
}

module.exports = new EmailService(); 