# Email Setup Guide for GameHub

Your GameHub store now includes comprehensive email functionality! Here's how to set it up:

## 🚀 Features Added

✅ **Welcome emails** - Sent automatically when users register  
✅ **Email verification** - Users must verify their email addresses  
✅ **Password reset** - Secure password reset via email  
✅ **Beautiful HTML templates** - Professional-looking emails with your branding  
✅ **Resend verification** - Users can request new verification emails  

## 📧 Email Configuration

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update your `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   EMAIL_FROM=GameHub <your_email@gmail.com>
   BASE_URL=http://localhost:3001
   ```

### Option 2: Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

**Custom SMTP:**
```env
EMAIL_HOST=your_smtp_server.com
EMAIL_PORT=587
EMAIL_USER=your_username
EMAIL_PASS=your_password
```

## 🔧 Production Setup

For production, consider using:
- **SendGrid** - Reliable email delivery service
- **Mailgun** - Developer-friendly email API
- **Amazon SES** - Cost-effective AWS email service

Example SendGrid configuration:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=GameHub <noreply@yourdomain.com>
BASE_URL=https://yourdomain.com
```

## 🎨 Email Templates

The system includes beautiful HTML email templates:

### Welcome Email
- Sent immediately after registration
- Includes branding and call-to-action
- Welcomes users to your platform

### Verification Email
- Sent for email verification
- Secure token-based verification
- 24-hour expiration

### Password Reset Email
- Secure password reset flow
- 1-hour token expiration
- Clear instructions

## 🔒 Security Features

- **Hashed tokens** - All email tokens are securely hashed
- **Expiration times** - Tokens expire automatically
- **Rate limiting** - Prevents email spam
- **Secure verification** - Email verification required for full access

## 🧪 Testing

1. **Start your server**: `npm start`
2. **Register a new account** at `http://localhost:3001`
3. **Check your email** for welcome and verification messages
4. **Test password reset** using the "Forgot Password" link

## 📱 User Experience

### Registration Flow:
1. User registers → Account created
2. Welcome email sent immediately
3. Verification email sent
4. User clicks verification link
5. Account fully activated

### Login Experience:
- Unverified users see reminder notifications
- One-click resend verification option
- Smooth password reset flow

## 🛠 Troubleshooting

**Emails not sending?**
- Check your email credentials in `.env`
- Verify SMTP settings
- Check server logs for error messages
- Test with a simple email service first

**Gmail issues?**
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure app access" if needed

**Verification links not working?**
- Check BASE_URL in `.env`
- Ensure server is accessible at that URL
- Verify token hasn't expired

## 🎯 Next Steps

1. **Configure your email settings** in `.env`
2. **Test the registration flow**
3. **Customize email templates** if needed
4. **Set up production email service**
5. **Monitor email delivery rates**

Your GameHub store now provides a professional email experience that builds trust with your customers! 🎮✨