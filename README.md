# Secure Content Workspace - Backend API

A secure, role-based content management system built with Node.js, Express, Prisma, and JWT authentication.

## 🚀 Features

- **JWT-based Authentication**: Secure user registration and login
- **Role-Based Access Control (RBAC)**: Admin, Editor, and Viewer roles
- **Article Management**: Full CRUD operations with draft/published states
- **Input Validation**: Zod schema validation
- **Error Handling**: Centralized error handling middleware
- **Pagination**: Efficient pagination for article listings
- **Security**: Password hashing with bcrypt, Helmet security headers, rate limiting

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL or MySQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: Your database connection string
   - `JWT_SECRET`: A strong secret key (minimum 32 characters)
   - `JWT_EXPIRES_IN`: Token expiration time (default: 24h)
   - `CORS_ORIGIN`: Frontend URL for CORS
   - `PORT`: Server port (default: 3000)

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

5. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, JWT)
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware (auth, validation, errors)
│   ├── routes/          # Route definitions
│   ├── utils/           # Utility functions (JWT, password, pagination)
│   ├── validators/      # Zod validation schemas
│   └── app.js           # Express app setup
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── package.json
└── server.js            # Entry point
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Articles

- `GET /api/articles` - Get paginated list of articles (public)
- `GET /api/articles/:id` - Get single article (public)
- `POST /api/articles` - Create article (Admin, Editor)
- `PUT /api/articles/:id` - Update article (Owner or Admin)
- `DELETE /api/articles/:id` - Delete article (Admin only)

## 🔑 Role-Based Permissions

| Role   | Create | Edit Own | Edit Any | Delete Own | Delete Any | View |
|--------|--------|----------|----------|------------|------------|------|
| ADMIN  | ✅      | ✅        | ✅        | ✅          | ✅          | ✅    |
| EDITOR | ✅      | ✅        | ❌        | ❌          | ❌          | ✅    |
| VIEWER | ❌      | ❌        | ❌        | ❌          | ❌          | ✅    |

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Create Article (Authenticated)
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Article",
    "content": "<p>Article content here...</p>",
    "status": "DRAFT"
  }'
```

### Get Articles with Pagination
```bash
curl "http://localhost:3000/api/articles?page=1&limit=10&status=PUBLISHED"
```

## 🧪 Development

### Database Management

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Environment Variables

Required environment variables:
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration (default: 24h)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Allowed CORS origin

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Role-based authorization middleware
- Input validation with Zod
- Rate limiting on auth endpoints
- Helmet security headers
- CORS configuration
- SQL injection protection (Prisma ORM)

## 📦 Dependencies

### Production
- `express`: Web framework
- `@prisma/client`: Prisma ORM client
- `prisma`: Prisma CLI
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT authentication
- `zod`: Schema validation
- `cors`: CORS middleware
- `helmet`: Security headers
- `express-rate-limit`: Rate limiting
- `dotenv`: Environment variables

### Development
- `nodemon`: Auto-restart on file changes
- `@types/node`: TypeScript types

## 🐛 Error Handling

All errors are handled centrally and return consistent JSON responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## 📄 License

ISC

## 👥 Author

Developed for BX Track Solution

