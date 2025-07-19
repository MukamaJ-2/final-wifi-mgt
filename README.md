# Admin User Management System

A professional full-stack application for managing admin users and guest accounts with secure authentication and comprehensive user management capabilities.

## 🏗️ Architecture

```
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express backend API
└── README.md         # Project documentation
```

## ✨ Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Password hashing with bcrypt
- Session management
- Rate limiting and security headers
- CORS protection

### 👥 User Management
- Admin registration and login
- Guest user creation with expiration dates
- User status management (active/inactive)
- Bulk user operations
- Real-time user statistics

### 🎨 Professional UI/UX
- Modern, responsive design
- Dark/light theme support
- Smooth animations and transitions
- Professional dashboard layout
- Mobile-friendly interface

### 🗄️ Database
- MySQL database with proper indexing
- Automated migrations
- Foreign key constraints
- Optimized queries

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=wifi
   DB_USER=your_username
   DB_PASSWORD=mukama
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Create database:**
   ```sql
   CREATE DATABASE admin_user_management;
   ```

5. **Run migrations:**
   ```bash
   npm run migrate
   ```

6. **Start backend server:**
   ```bash
   npm run dev
   ```

   Backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start frontend development server:**
   ```bash
   npm run dev
   ```

   Frontend will be running at `http://localhost:3000`

## 📊 Database Schema

### Tables

#### `admins`
- `id` - Primary key (UUID)
- `email` - Unique email address
- `password_hash` - Hashed password
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### `guest_users`
- `id` - Primary key (UUID)
- `username` - Unique username
- `password_hash` - Hashed password
- `created_at` - Creation timestamp
- `expires_at` - Expiration timestamp
- `is_active` - Active status
- `created_by` - Foreign key to admins table
- `updated_at` - Last update timestamp

#### `sessions`
- `id` - Primary key (UUID)
- `admin_id` - Foreign key to admins table
- `token_hash` - Hashed JWT token
- `expires_at` - Session expiration
- `created_at` - Creation timestamp

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/profile` - Get admin profile

### Guest Users
- `POST /api/guest-users` - Create guest user
- `GET /api/guest-users` - Get all guest users
- `PUT /api/guest-users/:id` - Update guest user
- `DELETE /api/guest-users/:id` - Delete guest user
- `PATCH /api/guest-users/:id/toggle-status` - Toggle user status

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Building for Production

#### Backend
```bash
cd backend
npm start  # Production mode
```

#### Frontend
```bash
cd frontend
npm run build  # Build for production
npm run preview  # Preview production build
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_user_management
DB_USER=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Admin User Management System
```

## 📁 Project Structure

```
admin-user-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── guestUserController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── guestUsers.js
│   ├── scripts/
│   │   └── migrate.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── index.html
└── README.md
```

## 🚦 Testing

### Backend Testing
```bash
cd backend
# Add your test commands here
```

### Frontend Testing
```bash
cd frontend
npm run lint  # ESLint checking
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent brute force attacks
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **Session Management**: Secure session handling

## 📈 Performance

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: MySQL connection pool for efficiency
- **Caching**: Frontend state management
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Updates

### Version 1.0.0
- Initial release
- Full authentication system
- User management features
- Professional UI/UX
- MySQL database integration
- Comprehensive API