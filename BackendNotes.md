# Study Mates - Application for Finding Study Partners

## Backend Architecture

### API Routes

#### **Auth Routes (`authRouter`)**

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| POST   | `/signup` | Register a new user |
| POST   | `/login`  | User authentication |
| POST   | `/logout` | User logout         |

#### **Profile Routes (`profileRouter`)**

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/profile/view`     | View user profile   |
| PATCH  | `/profile/edit`     | Edit user profile   |
| PATCH  | `/profile/password` | Forgot password API |

#### **Connection Requests (`connectionRequestRouter`)**

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| POST   | `/request/send/:status/:userId`      | Send connection request   |
| POST   | `/request/review/:status/:requestId` | Review connection request |

#### **User Routes (`userRouter`)**

| Method | Endpoint                  | Description                      |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/user/requests/received` | Get received connection requests |
| GET    | `/user/connections`       | Get list of connected users      |
| GET    | `/user/feed`              | Fetch profiles of other users    |

**Status Values:** `ignored`, `interested`, `accepted`, `rejected`

---

## Database and Schema Design

### MongoDB Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Connect to the database using Mongoose:
   ```sh
   npm install mongoose
   ```
3. Define a connection function in `database.js`:

### User Schema

- **Required Fields:** firstName, lastName, email, password (hashed), study preferences
- **Validations:** unique email, strong password, sanitized input
- **Indexes:** Indexed email for faster lookup

---

## Authentication and Security

### User Authentication

- Uses **bcrypt** for password hashing
- JWT-based authentication with cookies (expires in 7 days)
- **Middleware:** `userAuth` for protected routes

### Security Best Practices

- Data validation using **validator.js**
- API validation for all request bodies
- **Error Handling:** Try/catch blocks for database operations
- Never trust `req.body` – always sanitize input

---

## API Functionality & Features

### Signup & Login Flow

1. Validate input using middleware.
2. Hash the password using **bcrypt** before storing.
3. Generate and return a **JWT token** upon successful login.

### Connection Requests

- Users can send connection requests.
- Requests can have statuses: `ignored`, `interested`, `accepted`, `rejected`.
- Users can review and update the status of requests.

### Feed API (`/user/feed`)

- Retrieves profiles of other users except blocked ones.
- Uses **pagination** to limit data per request:
  ```sh
  /feed?page=1&limit=10   # Returns users 1-10
  /feed?page=2&limit=10   # Returns users 11-20
  ```
  ```js
  .skip((page - 1) * limit).limit(limit)
  ```
- Uses MongoDB `$nin`, `$and`, `$ne` queries to filter results.

### Profile Management

- Users can view and edit their profiles.
- Password updates via PATCH `/profile/password` (Forgot Password API)
- Middleware ensures users can only modify their own profile.

---

## Middleware & Error Handling

### Custom Middlewares

- **`userAuth`** – Verifies JWT token and authenticates users.
- **Request Validation** – Ensures input data is sanitized.
- **Global Error Handler**
  ```js
  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  });
  ```

---

## Performance Optimization

### Database Indexing

- Index on `email` field for faster lookups.
- Compound indexes for efficient queries.

### Pagination Implementation

- Uses `.skip()` and `.limit()` for efficient data fetching.
- Ensures app does not fetch unnecessary data.

---

## Future Improvements

1. **Real-time Chat** – Implement Socket.IO for messaging between study partners.
2. **Matchmaking Algorithm** – Improve user recommendations using AI/ML.
3. **Push Notifications** – Notify users about connection requests.
4. **Mobile App Integration** – Extend backend to support mobile clients.

---
