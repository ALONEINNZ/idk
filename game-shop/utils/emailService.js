const nodemailer = require('nodemailer');

// Create transporter - for demo, we'll use a test account or log emails
const createTransporter = () => {
  // Check if we have real email credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'your_email@gmail.com') {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Demo mode - create ethereal test account
    return nodemailer.createTestAccount().then(testAccount => {
      return nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }).catch(() => {
      // If ethereal fails, return null to use console logging
      return null;
    });
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = await createTransporter();
    
    // If no transporter available, log to console (demo mode)
    if (!transporter) {
      console.log(`
🎮 DEMO EMAIL SERVICE 🎮
========================
TO: ${email}
SUBJECT: Welcome to GameHub! 🎮

Hi ${username}!

Welcome to GameHub! Your account has been successfully created.

This is a demo - in production, this would be sent via email.
========================
      `);
      return true;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'GameHub <noreply@gamehub.demo>',
      to: email,
      subject: 'Welcome to GameHub! 🎮',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 2.5rem;">🎮 GameHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.2rem; opacity: 0.9;">Your Digital Game Store</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="margin-top: 0; color: #fff;">Welcome, ${username}! 🎉</h2>
            
            <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining GameHub! Your account has been successfully created and you're ready to start exploring our amazing collection of digital games.
            </p>
            
            <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #fff;">What's Next?</h3>
              <ul style="padding-left: 20px; line-height: 1.8;">
                <li>Browse our extensive game library</li>
                <li>Add games to your wishlist</li>
                <li>Enjoy secure and instant downloads</li>
                <li>Get exclusive deals and early access</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.BASE_URL || 'http://localhost:3002'}" style="display: inline-block; background: #fff; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 1.1rem;">
                Start Shopping Now
              </a>
            </div>
            
            <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0;">
              If you have any questions, feel free to contact our support team. Happy gaming!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; opacity: 0.7;">
            <p>© 2026 GameHub. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
        Welcome to GameHub, ${username}!
        
        Thank you for joining our digital game store. Your account has been successfully created.
        
        What's next:
        - Browse our game library
        - Add games to your wishlist  
        - Enjoy secure downloads
        - Get exclusive deals
        
        Visit us at: ${process.env.BASE_URL || 'http://localhost:3002'}
        
        Happy gaming!
        GameHub Team
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
    const transporter = await createTransporter();
    
    // If no transporter available, log to console (demo mode)
    if (!transporter) {
      console.log(`
🎮 DEMO EMAIL SERVICE 🎮
========================
TO: ${email}
SUBJECT: Verify Your GameHub Account 🎮

Hi ${username}!

Please verify your email address to complete your GameHub account setup.
Verification token: ${verificationToken}

This is a demo - in production, this would be sent via email.
========================
      `);
      return true;
    }
    
    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3002'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'GameHub <noreply@gamehub.demo>',
      to: email,
      subject: 'Verify Your GameHub Account 🎮',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 2.5rem;">🎮 GameHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.2rem; opacity: 0.9;">Your Digital Game Store</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="margin-top: 0; color: #fff;">Verify Your Email Address</h2>
            
            <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
              Hi ${username}! Please verify your email address to complete your GameHub account setup.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: #fff; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 1.1rem;">
                Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0;">
              If the button doesn't work, copy and paste this link: ${verificationUrl}
            </p>
          </div>
        </div>
      `,
      text: `
        Verify Your GameHub Account
        
        Hi ${username}!
        
        Please verify your email address by clicking this link:
        ${verificationUrl}
        
        GameHub Team
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
    const transporter = await createTransporter();
    
    // If no transporter available, log to console (demo mode)
    if (!transporter) {
      console.log(`
🎮 DEMO EMAIL SERVICE 🎮
========================
TO: ${email}
SUBJECT: Reset Your GameHub Password 🔐

Hi ${username}!

We received a request to reset your password.
Reset token: ${resetToken}

This is a demo - in production, this would be sent via email.
========================
      `);
      return true;
    }
    
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3002'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'GameHub <noreply@gamehub.demo>',
      to: email,
      subject: 'Reset Your GameHub Password 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 2.5rem;">🎮 GameHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.2rem; opacity: 0.9;">Your Digital Game Store</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="margin-top: 0; color: #fff;">Reset Your Password</h2>
            
            <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
              Hi ${username}! We received a request to reset your password. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #fff; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 1.1rem;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0;">
              If you didn't request this, please ignore this email. The link will expire in 1 hour.
            </p>
          </div>
        </div>
      `,
      text: `
        Reset Your GameHub Password
        
        Hi ${username}!
        
        Click this link to reset your password:
        ${resetUrl}
        
        If you didn't request this, please ignore this email.
        
        GameHub Team
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