# Secure Content Workspace - Backend API

A secure, role-based content management system backend built with Node.js, Express, Prisma ORM, and JWT authentication.

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5.2.1)
- **Database**: PostgreSQL
- **ORM**: Prisma (v6.0.0)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt (v6.0.0)
- **Validation**: Zod (v4.3.4)

### Security & Middleware
- **Security Headers**: Helmet
- **CORS**: cors
- **Rate Limiting**: express-rate-limit
- **Environment Variables**: dotenv

## 📁 Project Architecture

### Directory Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Prisma client instance
│   │   └── jwt.js       # JWT configuration
│   ├── controllers/     # Request handlers (thin layer)
│   │   ├── authController.js
│   │   └── articleController.js
│   ├── services/        # Business logic layer
│   │   ├── authService.js
│   │   └── articleService.js
│   ├── middleware/      # Custom middleware
│   │   ├── authMiddleware.js    # JWT authentication
│   │   ├── authorize.js         # Role-based authorization
│   │   ├── checkOwner.js        # Ownership verification
│   │   ├── errorHandler.js      # Centralized error handling
│   │   └── validate.js          # Request validation wrapper
│   ├── routes/          # Route definitions
│   │   ├── authRoutes.js
│   │   ├── articleRoutes.js
│   │   └── index.js
│   ├── utils/           # Utility functions
│   │   ├── errors.js    # Error formatting
│   │   ├── jwt.js       # JWT token generation/verification
│   │   ├── password.js  # Password hashing/comparison
│   │   └── pagination.js # Pagination helpers
│   └── validators/      # Zod validation schemas
│       ├── authValidator.js
│       └── articleValidator.js
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.js          # Database seeding script
├── scripts/
│   └── add-editor.js    # Utility script to add editors
├── server.js             # Application entry point
└── package.json
```

### Architecture Pattern
The backend follows a **layered architecture** pattern:

1. **Routes Layer** (`routes/`): Defines API endpoints and applies middleware
2. **Controllers Layer** (`controllers/`): Handles HTTP requests/responses
3. **Services Layer** (`services/`): Contains business logic and database operations
4. **Middleware Layer** (`middleware/`): Handles authentication, authorization, validation, and errors
5. **Utils Layer** (`utils/`): Reusable utility functions

### Design Principles
- **Separation of Concerns**: Each layer has a specific responsibility
- **DRY (Don't Repeat Yourself)**: Reusable middleware and utilities
- **Single Responsibility**: Each module does one thing well
- **Error Handling**: Centralized error handling with consistent responses
- **Security First**: Authentication, authorization, and input validation at every layer

## 🔐 Role & Permission Logic

### User Roles

The system implements three roles with hierarchical permissions:

#### 1. **ADMIN**
- **Full Access**: Can perform all operations on all articles
- **Permissions**:
  - ✅ Create articles
  - ✅ Edit any article (regardless of author)
  - ✅ Delete any article
  - ✅ View all articles (including drafts)
  - ✅ Manage user roles (via database)

#### 2. **EDITOR**
- **Own Content Management**: Can create and manage their own articles
- **Permissions**:
  - ✅ Create articles
  - ✅ Edit own articles only
  - ✅ Delete own articles only
  - ✅ View published articles + own drafts
  - ❌ Cannot edit/delete other users' articles
  - ❌ Cannot view other users' drafts

#### 3. **VIEWER**
- **Read-Only Access**: Can only view published content
- **Permissions**:
  - ✅ View published articles only
  - ❌ Cannot create articles
  - ❌ Cannot edit articles
  - ❌ Cannot delete articles
  - ❌ Cannot view draft articles

### Permission Matrix

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| **Create Article** | ✅ | ✅ | ❌ |
| **Edit Own Article** | ✅ | ✅ | ❌ |
| **Edit Any Article** | ✅ | ❌ | ❌ |
| **Delete Own Article** | ✅ | ✅ | ❌ |
| **Delete Any Article** | ✅ | ❌ | ❌ |
| **View Published** | ✅ | ✅ | ✅ |
| **View Own Drafts** | ✅ | ✅ | ❌ |
| **View All Drafts** | ✅ | ❌ | ❌ |

### Implementation Details

#### Authentication Flow
1. User registers/logs in → Receives JWT token
2. Token stored in `Authorization: Bearer <token>` header
3. `authMiddleware` verifies token and attaches user to request
4. `authorize` middleware checks if user role matches required roles
5. `checkOwner` middleware verifies article ownership (for Editors)

#### Authorization Middleware
- **`authenticate`**: Verifies JWT token, attaches user to `req.user`
- **`authorize(...roles)`: Checks if user role is in allowed roles list
- **`checkArticleOwner()`**: Verifies user is article owner OR admin

#### Article Access Control
- **Public Access**: Published articles visible to everyone
- **Draft Articles**: Only visible to author and admins
- **Edit/Delete**: Owner or Admin can modify/delete

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://user:password@localhost:5432/database_name?sslmode=require"

   # JWT Configuration
   JWT_SECRET="your-very-secure-secret-key-minimum-32-characters-long"
   JWT_EXPIRES_IN="24h"

   # Server Configuration
   PORT=3000
   NODE_ENV="development"

   # CORS Configuration
   CORS_ORIGIN="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations to create tables
   npm run prisma:migrate
   # OR use db push for development
   npx prisma db push

   # Seed database with test users
   npm run prisma:seed
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user (defaults to VIEWER role).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "ADMIN"
    },
    "token": "jwt_token_here"
  }
}
```

### Articles

#### GET `/api/articles` (Public)
Get paginated list of articles.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (`DRAFT` or `PUBLISHED`)
- `authorId` (optional): Filter by author ID
- `search` (optional): Search in title and content

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET `/api/articles/:id` (Public)
Get single article by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "uuid",
      "title": "Article Title",
      "content": "<p>Article content...</p>",
      "status": "PUBLISHED",
      "authorId": "uuid",
      "author": {
        "id": "uuid",
        "name": "Author Name",
        "email": "author@example.com"
      },
      "createdAt": "2026-01-02T...",
      "updatedAt": "2026-01-02T..."
    }
  }
}
```

#### POST `/api/articles` (Admin, Editor)
Create a new article.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "<p>Article content...</p>",
  "status": "DRAFT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {...}
  }
}
```

#### PUT `/api/articles/:id` (Owner or Admin)
Update an article.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>",
  "status": "PUBLISHED"
}
```

#### DELETE `/api/articles/:id` (Admin or Owner)
Delete an article.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Middleware-based access control
- **Input Validation**: Zod schema validation for all inputs
- **Rate Limiting**: 5 requests per 15 minutes on auth endpoints
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable CORS for frontend access
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **Error Handling**: No sensitive information leaked in errors

## 🧪 Test Accounts

After running `npm run prisma:seed`, you'll have:

- **Admin**: `admin@example.com` / `Admin123!`
- **Editor**: `editor@example.com` / `Editor123!`
- **Viewer**: `viewer@example.com` / `Viewer123!`

## 📝 Assumptions and Trade-offs

### Assumptions

1. **Default Role**: New users register as VIEWER by default. Admins must manually upgrade users to EDITOR or ADMIN roles via database.

2. **Article Ownership**: Articles are tied to their author. Editors can only manage their own articles, while Admins can manage all articles.

3. **Draft Visibility**: Draft articles are only visible to their author and admins. Published articles are visible to everyone.

4. **Pagination**: Default page size is 10 articles, with a maximum of 100 per page to prevent performance issues.

5. **Token Expiration**: JWT tokens expire after 24 hours. Users must re-login after expiration.

6. **Password Requirements**: Passwords must be at least 8 characters with uppercase, lowercase, and numbers (enforced on frontend).

### Trade-offs

1. **No Refresh Tokens**: Implemented simple JWT authentication without refresh tokens for simplicity. Users must re-login when tokens expire.

2. **No User Management API**: User role management is done directly via database or scripts, not through API endpoints. This keeps the API focused on content management.

3. **No Soft Delete**: Articles are permanently deleted. No recovery mechanism implemented.

4. **No Audit Logs**: No tracking of who created/edited/deleted articles or when. This was considered optional.

5. **No File Uploads**: Article content is HTML text only. No image or file upload functionality.

6. **No Search Indexing**: Search uses basic SQL LIKE queries. No full-text search indexing for better performance at scale.

7. **Single Database**: All data stored in PostgreSQL. No separate caching layer or read replicas.

8. **Synchronous Operations**: All operations are synchronous. No background jobs or async processing.

## 🛠️ Development

### Database Management

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Push schema changes (development)
npx prisma db push

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

### Adding Editors

Use the provided script to add or upgrade users to Editor role:

```bash
# Create new editor
node scripts/add-editor.js editor2@example.com "Editor 2" "Password123!"

# Upgrade existing user
node scripts/add-editor.js existing@example.com
```

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

All errors return consistent JSON responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `DUPLICATE_EMAIL`: Email already registered
- `INVALID_CREDENTIALS`: Wrong email/password

## 📄 License

ISC

## 👥 Author

Developed for BX Track Solution

