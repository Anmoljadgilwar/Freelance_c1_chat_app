# Customer Chat Application

A real-time customer support chat application built with React, Node.js, and Socket.IO.

## Features of App

- **User Authentication**: Register and login functionality
- **Role-based Access**: Admin and regular user roles
- **Real-time Chat**: Instant messaging between customers and admin
- **WhatsApp-like UI**: Modern chat interface with message bubbles
- **Read Receipts**: Blue tick indicators for read messages
- **Mobile Responsive**: Works on all device sizes
- **Admin Dashboard**: Manage all customer conversations

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS v4
- React Router DOM
- Axios for API calls
- Socket.IO Client

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing

## Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas connection

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd customer-chat-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   ```bash
   cd ../backend
   # Edit config.env file with your MongoDB URI and JWT secret
   ```

5. **Create admin user**

   ```bash
   cd backend
   node createAdmin.js
   ```

6. **Start the application**

   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory, in new terminal)
   npm run dev
   ```

## Usage

### For Customers (Regular Users)

1. **Register/Login**: Create an account or login
2. **Chat with Admin**: Automatically connected to admin support
3. **Send Messages**: Type and send messages to get help
4. **View Status**: See read receipts and message timestamps

### For Admin Users

1. **Login**: Use admin credentials (admin@example.com / admin123)
2. **Access Dashboard**: Navigate to Admin Dashboard
3. **View Customers**: See all registered customers
4. **Manage Conversations**: Chat with any customer
5. **Monitor Activity**: Track online status and unread messages

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `GET /api/auth/admin` - Find admin user (for customers)
- `GET /api/auth/users` - Get all users (admin only)

### Chat

- `POST /api/chat/send` - Send a message
- `GET /api/chat/conversation/:userId` - Get conversation with user
- `GET /api/chat/conversations` - Get all conversations
- `PUT /api/chat/read/:messageId` - Mark message as read
- `GET /api/chat/unread` - Get unread message count

## File Structure

```
customer-chat-app/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── uploadConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── chatRoutes.js
│   ├── server.js
│   ├── createAdmin.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Chat/
│   │   │   │   └── Chat.jsx
│   │   │   ├── Admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── UI/
│   │   │       └── Loading.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Features in Detail

### WhatsApp-like UI

- **Message Bubbles**: Rounded corners with different colors for sender/receiver
- **Timestamps**: Smart time display (time, yesterday, date)
- **Read Receipts**: Blue tick indicators for read messages
- **Online Status**: Real-time online/offline indicators
- **Unread Counts**: Badge showing unread messages

### Real-time Features

- **Instant Messaging**: Messages appear immediately
- **Typing Indicators**: Shows when someone is typing
- **Online Status**: Real-time online/offline updates
- **Read Receipts**: Instant read status updates

### Admin Dashboard

- **Customer List**: View all registered customers
- **Conversation Management**: Switch between customer chats
- **Unread Indicators**: See which customers have unread messages
- **Last Message Preview**: Quick overview of recent activity

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access**: Admin-only endpoints protected
- **CORS Configuration**: Proper cross-origin resource sharing

## Deployment

### Backend

- Set `NODE_ENV=production` in environment
- Use MongoDB Atlas for production database
- Configure proper CORS origins
- Use environment variables for sensitive data

### Frontend

- Build with `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update API base URL for production

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running
2. **CORS Errors**: Check backend CORS configuration
3. **Admin Access**: Verify admin user exists in database
4. **Port Conflicts**: Check if ports 5000/3000 are available

### Debug Mode

- Backend: Check console logs for connection status
- Frontend: Check browser console for API errors
- Database: Verify MongoDB connection string

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
