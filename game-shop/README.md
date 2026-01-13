# ExusCraft - Gaming Marketplace

🔥 **Your Ultimate Gaming Marketplace**

A modern, responsive gaming marketplace built with Node.js, Express, and MongoDB.

## Features

- 🎮 **Game & Mod Marketplace** - Browse and purchase games and mods
- 🤖 **AI Chatbot** - ExusBot for gaming & tech support
- 🛒 **Shopping Cart** - Secure checkout system
- 👤 **User Profiles** - Account management and achievements
- 📧 **Email System** - Welcome emails and notifications
- 🎨 **Modern Design** - Beautiful gradient UI with animations
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: Vanilla JavaScript, CSS3
- **Email**: Nodemailer
- **Payments**: Stripe integration

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```env
   PORT=3007
   MONGODB_URI=mongodb://localhost:27017/gameshop
   JWT_SECRET=your_jwt_secret_here
   ```

3. Seed the database:
   ```bash
   node seedGames.js
   node seedMods.js
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Deployment

This app is configured for easy deployment on Render, Vercel, or Railway.

## License

MIT License