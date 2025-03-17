using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;

namespace Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string verificationLink)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = subject;

        string emailBody = GenerateEmailBody(verificationLink);
        
        message.Body = new TextPart("html") { Text = emailBody };

        using (var client = new SmtpClient())
        {
            await client.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]),
                MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(emailSettings["SenderEmail"], emailSettings["Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }

    private string GenerateEmailBody(string verificationLink)
    {
        return $@"
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }}
            .header {{
                background: #007bff;
                padding: 15px;
                color: #ffffff;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                padding: 20px;
                font-size: 16px;
                color: #333333;
                word-wrap: break-word;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #777777;
            }}
        </style>
    </head>
    <body>
        <div class=""container"">
            <div class=""header"">Verify Your Email</div>
            <div class=""content"">
                <p>Hello,</p>
                <p>Thank you for registering. Please confirm your email address</p>
                <p style=""font-weight: bold; word-break: break-all;"">{verificationLink}</p>
                <p>If you did not create an account, you can safely ignore this email.</p>
            </div>
            <div class=""footer"">
                <p>&copy; 2025 MSGames | Visit Our Website: https://localhost:4200/</p>
            </div>
        </div>
    </body>
    </html>";
    }
}