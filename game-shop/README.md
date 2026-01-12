# GameHub - Digital Game Store

A modern, full-stack web application for selling digital games online. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

### For Customers
- Browse games by category and search
- User registration and authentication
- Shopping cart functionality
- Secure payment processing (Stripe integration)
- Game library with download links
- Responsive design for all devices

### For Admins
- Add, edit, and delete games
- Upload game images
- Manage orders and users
- View sales analytics

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **File Upload**: Multer

## Quick Start

1. **Install Dependencies**
   ```bash
   cd game-shop
   npm install
   ```

2. **Set Up Environment Variables**
   Edit the `.env` file with your configuration:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/gameshop
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the Application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## Project Structure

```
game-shop/
├── models/           # Database models
│   ├── Game.js
│   ├── User.js
│   └── Order.js
├── routes/           # API routes
│   ├── auth.js
│   ├── games.js
│   └── orders.js
├── middleware/       # Custom middleware
│   ├── auth.js
│   └── adminAuth.js
├── public/           # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── uploads/          # Uploaded game images
├── server.js         # Main server file
├── package.json
└── .env             # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Games
- `GET /api/games` - Get all games (with filters)
- `GET /api/games/:id` - Get single game
- `POST /api/games` - Create game (admin only)
- `PUT /api/games/:id` - Update game (admin only)
- `DELETE /api/games/:id` - Delete game (admin only)

### Orders
- `POST /api/orders/create-payment-intent` - Create Stripe payment intent
- `POST /api/orders/confirm-purchase` - Confirm purchase
- `GET /api/orders/my-orders` - Get user orders

## Setup Instructions

### 1. MongoDB Setup
Install and start MongoDB on your system, or use MongoDB Atlas for cloud hosting.

### 2. Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env` file
4. Update the Stripe publishable key in `public/app.js`

### 3. Admin User
To create an admin user, you can either:
- Manually update a user's role to 'admin' in MongoDB
- Add a registration endpoint that creates admin users (for development)

### 4. File Uploads
Create an `uploads` directory in the project root for game image storage.

## Customization

### Adding New Game Categories
Update the category enum in `models/Game.js` and the dropdown in `public/index.html`.

### Styling
Modify `public/styles.css` to customize the appearance. The current design uses a modern gradient theme.

### Payment Integration
The current implementation includes Stripe integration. For production:
1. Replace the demo payment flow in `public/app.js`
2. Implement proper Stripe Elements for card input
3. Add webhook handling for payment confirmations

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Admin-only routes protection
- CORS configuration
- File upload restrictions

## Production Deployment

1. Set up a production MongoDB instance
2. Configure environment variables for production
3. Set up proper SSL certificates
4. Configure a reverse proxy (nginx)
5. Use PM2 or similar for process management
6. Set up proper logging and monitoring

## License

MIT License - feel free to use this project for your own game store!