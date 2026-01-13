# Email Setup Guide for GameHub

## ✅ CONFIGURED: Gmail Setup Complete

Your GameHub store is now configured to send emails using **burnsidetimetable@gmail.com**!

## 🔧 Current Configuration

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=burnsidetimetable@gmail.com
EMAIL_PASS=your_gmail_app_password_here  # ⚠️ NEEDS APP PASSWORD
EMAIL_FROM=GameHub <burnsidetimetable@gmail.com>
BASE_URL=http://localhost:3002
```

## 🚨 REQUIRED: Generate Gmail App Password

**You need to complete this step for emails to work:**

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", enable "2-Step Verification"
3. Follow the setup process if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Windows Computer" as the device
4. Click "Generate"
5. **Copy the 16-character password** (format: abcd efgh ijkl mnop)

### Step 3: Update Configuration
1. Open `game-shop/.env`
2. Replace `your_gmail_app_password_here` with your generated app password
3. Save the file

### Step 4: Restart Server
```bash
cd game-shop
node server-demo.js
```

## 🎮 Email Features Active

✅ **Welcome emails** - Sent when users register  
✅ **Professional HTML templates** - GameHub branded emails  
✅ **Fallback logging** - Console output if email fails  
✅ **Error handling** - Registration won't fail if email fails  

## 🧪 Testing Email Functionality

1. **Start the server**: `node server-demo.js`
2. **Register a new account** at `http://localhost:3002`
3. **Check console** for "Welcome email sent to [email]"
4. **Check Gmail sent folder** for actual sent emails
5. **Check recipient inbox** for GameHub welcome email

## 📧 Email Template Preview

The welcome email includes:
- 🎮 GameHub branding with gradient design
- 👋 Personal welcome message
- 🎯 Call-to-action button to start shopping
- 📱 Mobile-friendly responsive design
- 🔗 Link back to your store

## 🔒 Security Notes

- ✅ App passwords are more secure than regular passwords
- ✅ .env file is in .gitignore (won't be committed)
- ✅ Email service has error handling
- ✅ Registration continues even if email fails

## 🛠 Troubleshooting

**"Invalid credentials" error:**
- Double-check your app password is correct
- Ensure 2FA is enabled on Gmail account
- Make sure you're using app password, not regular password

**Emails not sending:**
- Check server console for error messages
- Verify Gmail app password is 16 characters
- Test with a simple registration

**Gmail blocking:**
- Use app password (never regular password)
- Ensure 2FA is enabled
- Check Google Account security settings

## 🎯 What Happens Next

1. **Complete the app password setup above**
2. **Test with a registration**
3. **Users will receive beautiful welcome emails**
4. **Check Gmail sent folder to confirm delivery**

Your GameHub store will provide a professional email experience! 🎮✨