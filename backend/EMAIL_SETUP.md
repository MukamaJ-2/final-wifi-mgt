# Email Configuration Guide

## Setup Email for User Credentials

To enable automatic email sending when creating new users, follow these steps:

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Use the generated password** (not your regular Gmail password)

### 2. Environment Variables

Create a `.env` file in the backend directory with:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mukama
DB_NAME=wifi

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Alternative Email Providers

For other email providers, update the `createTransporter` function in `services/emailService.js`:

```javascript
// For Outlook/Hotmail
return nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// For custom SMTP
return nodemailer.createTransport({
  host: 'your-smtp-host.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### 4. Test Email Configuration

Run this command to test your email setup:

```bash
cd backend
node -e "import('./services/emailService.js').then(m => m.testEmailConfig())"
```

### 5. Current Behavior

- **Without email config**: System works normally, credentials are logged to console
- **With email config**: System sends professional HTML emails to new users
- **Email template**: Includes username, password, expiration date, and security notes

### 6. Security Notes

- Never commit your `.env` file to version control
- Use app passwords, not regular passwords
- Consider using environment variables in production
- The email template is professional and secure

## Troubleshooting

### Common Issues:

1. **"Invalid login"**: Check your app password
2. **"Less secure app"**: Use app passwords instead
3. **"Connection timeout"**: Check your internet connection
4. **"Authentication failed"**: Verify email and password

### Testing:

Create a test user through the frontend or API to verify email sending works correctly. 