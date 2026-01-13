const nodemailer = require('nodemailer');

// Create transporter - Gmail configuration
const createTransporter = () => {
  // Check if we have real email credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'your_email@gmail.com') {
    
    console.log('📧 Creating Gmail transporter...');
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    console.log('📧 No email credentials found, using console logging');
    return null;
  }
};

// Modern email template function
const getEmailTemplate = (title, content, buttonText, buttonUrl) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%); padding: 40px 20px; text-align: center; border-radius: 15px 15px 0 0;">
        <h1 style="margin: 0; font-size: 2.8rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🔥 ExusCraft</h1>
        <p style="margin: 10px 0 0 0; font-size: 1.3rem; color: rgba(255,255,255,0.9); font-weight: 300;">Your Ultimate Gaming Marketplace</p>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h2 style="margin-top: 0; color: #2c3e50; font-size: 1.8rem; font-weight: 600;">${title}</h2>
        
        ${content}
        
        ${buttonText && buttonUrl ? `
        <div style="text-align: center; margin: 40px 0;">
          <a href="${buttonUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(255,107,107,0.3); transition: all 0.3s ease;">
            ${buttonText}
          </a>
        </div>
        ` : ''}
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #7f8c8d; font-size: 0.9rem; margin: 0;">
            © 2026 ExusCraft. Crafting the future of gaming.
          </p>
        </div>
      </div>
    </div>
  `;
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter available, log to console (demo mode)
    if (!transporter) {
      console.log(`
🔥 DEMO EMAIL SERVICE 🔥
========================
TO: ${email}
SUBJECT: Welcome to ExusCraft! 🔥

Hi ${username}!

Welcome to ExusCraft! Your account has been successfully created.

This is a demo - in production, this would be sent via email.
========================
      `);
      return true;
    }
    
    const content = `
      <p style="font-size: 1.1rem; line-height: 1.8; color: #34495e; margin-bottom: 25px;">
        Welcome, <strong>${username}</strong>! 🎉
      </p>
      
      <p style="font-size: 1rem; line-height: 1.7; color: #34495e; margin-bottom: 25px;">
        Thank you for joining ExusCraft! Your account has been successfully created and you're ready to start exploring our incredible collection of games and mods.
      </p>
      
      <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ff6b6b;">
        <h3 style="margin-top: 0; color: #2c3e50; font-size: 1.3rem;">🚀 What's Next?</h3>
        <ul style="padding-left: 20px; line-height: 1.8; color: #34495e; margin: 0;">
          <li>🎮 Browse our extensive game library</li>
          <li>⭐ Add games to your wishlist</li>
          <li>⚡ Enjoy secure and instant downloads</li>
          <li>🎁 Get exclusive deals and early access</li>
          <li>🔧 Discover amazing mods and customizations</li>
        </ul>
      </div>
      
      <p style="font-size: 0.95rem; color: #7f8c8d; margin-bottom: 0; text-align: center;">
        If you have any questions, our support team is here to help. Happy gaming! 🎮
      </p>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ExusCraft <noreply@exuscraft.demo>',
      to: email,
      subject: 'Welcome to ExusCraft! 🔥',
      html: getEmailTemplate('Welcome to ExusCraft! 🎉', content, 'Start Exploring', `${process.env.BASE_URL || 'http://localhost:3003'}?action=login`),
      text: `
        Welcome to ExusCraft, ${username}!
        
        Thank you for joining our gaming marketplace. Your account has been successfully created.
        
        What's next:
        - Browse our game library
        - Add games to your wishlist  
        - Enjoy secure downloads
        - Get exclusive deals
        - Discover amazing mods
        
        Visit us at: ${process.env.BASE_URL || 'http://localhost:3003'}?action=login
        
        Happy gaming!
        ExusCraft Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}:`, nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Still return true for demo purposes
    console.log(`DEMO: Welcome email would be sent to ${email}`);
    return true;
  }
};

// Send email verification
const sendVerificationEmail = async (email, username, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter available, log to console (demo mode)
    if (!transporter) {
      console.log(`
🔥 DEMO EMAIL SERVICE 🔥
========================
TO: ${email}
SUBJECT: Verify Your ExusCraft Account 🔥

Hi ${username}!

Please verify your email address to complete your ExusCraft account setup.
Verification token: ${verificationToken}

This is a demo - in production, this would be sent via email.
========================
      `);
      return true;
    }
    
    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3003'}/verify-email?token=${verificationToken}`;
    
    const content = `
      <p style="font-size: 1.1rem; line-height: 1.8; color: #34495e; margin-bottom: 25px;">
        Hi <strong>${username}</strong>! 👋
      </p>
      
      <p style="font-size: 1rem; line-height: 1.7; color: #34495e; margin-bottom: 25px;">
        Please verify your email address to complete your ExusCraft account setup and unlock all features.
      </p>
      
      <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f39c12;">
        <p style="margin: 0; color: #856404; font-weight: 500;">
          ⚡ Quick verification required to activate your account
        </p>
      </div>
      
      <p style="font-size: 0.9rem; color: #7f8c8d; margin-top: 30px; text-align: center;">
        If the button doesn't work, copy and paste this link:<br>
        <span style="word-break: break-all; color: #3498db;">${verificationUrl}</span>
      </p>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ExusCraft <noreply@exuscraft.demo>',
      to: email,
      subject: 'Verify Your ExusCraft Account 🔥',
      html: getEmailTemplate('Verify Your Email Address', content, 'Verify Email Address', verificationUrl),
      text: `
        Verify Your ExusCraft Account
        
        Hi ${username}!
        
        Please verify your email address by clicking this link:
        ${verificationUrl}
        
        ExusCraft Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}:`, nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    console.log(`DEMO: Verification email would be sent to ${email}`);
    return true;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter available, log to console (demo mode)
    if (!transporter) {
      console.log(`
🔥 DEMO EMAIL SERVICE 🔥
========================
TO: ${email}
SUBJECT: Reset Your ExusCraft Password 🔐

Hi ${username}!

We received a request to reset your password.
Reset token: ${resetToken}

This is a demo - in production, this would be sent via email.
========================
      `);
      return true;
    }
    
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3003'}/reset-password?token=${resetToken}`;
    
    const content = `
      <p style="font-size: 1.1rem; line-height: 1.8; color: #34495e; margin-bottom: 25px;">
        Hi <strong>${username}</strong>! 🔐
      </p>
      
      <p style="font-size: 1rem; line-height: 1.7; color: #34495e; margin-bottom: 25px;">
        We received a request to reset your password. Click the button below to create a new password for your ExusCraft account.
      </p>
      
      <div style="background: linear-gradient(135deg, #d1ecf1, #bee5eb); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #17a2b8;">
        <p style="margin: 0; color: #0c5460; font-weight: 500;">
          🔒 This link will expire in 1 hour for security
        </p>
      </div>
      
      <p style="font-size: 0.9rem; color: #7f8c8d; margin-top: 30px; text-align: center;">
        If you didn't request this password reset, please ignore this email. Your account remains secure.
      </p>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ExusCraft <noreply@exuscraft.demo>',
      to: email,
      subject: 'Reset Your ExusCraft Password 🔐',
      html: getEmailTemplate('Reset Your Password', content, 'Reset Password', resetUrl),
      text: `
        Reset Your ExusCraft Password
        
        Hi ${username}!
        
        Click this link to reset your password:
        ${resetUrl}
        
        If you didn't request this, please ignore this email.
        
        ExusCraft Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}:`, nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    console.log(`DEMO: Password reset email would be sent to ${email}`);
    return true;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};