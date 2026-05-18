# Database Setup for Login/Signup - Kshetra Kredit

## ✅ Setup Complete

Your MongoDB Atlas database has been successfully configured to store signup and login details.

## 📊 Database Collections

The following collections have been created in your `kshetraKredit` database:

1. **`users`** - Stores user account information
2. **`login_history`** - Tracks all login attempts (successful and failed)
3. **`loan_requests`** - Loan request data
4. **`fundings`** - Funding information
5. **`repayments`** - Repayment tracking

## 🔐 User Model Fields

The `users` collection now includes the following fields for authentication tracking:

- `id` - Unique user identifier
- `email` - User email (unique)
- `password` - Hashed password
- `name` - User's full name
- `role` - User role (BORROWER or LENDER)
- `creditScore` - Credit score (default: 650)
- `trustScore` - Trust score (default: 70)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp
- `lastLogin` - Last successful login timestamp
- `loginCount` - Total number of successful logins
- `isActive` - Account status (active/inactive)
- `emailVerified` - Email verification status

## 📝 Login History Model

The `login_history` collection tracks all login attempts with:

- `id` - Unique identifier
- `userId` - Reference to user (if exists)
- `email` - Email used in login attempt
- `success` - Whether login was successful (true/false)
- `ipAddress` - IP address of the login attempt
- `userAgent` - Browser/device information
- `failureReason` - Reason for failed login (if applicable)
- `createdAt` - Timestamp of the login attempt

**Indexes created for performance:**
- Index on `userId` for quick user lookup
- Index on `email` for email-based queries
- Index on `createdAt` for time-based queries

## 🔧 Configuration

### Environment Variables (.env)

The following environment variables have been configured:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/kshetraKredit?retryWrites=true&w=majority"
JWT_SECRET="change_this_to_a_strong_random_value"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```

## 🚀 Features Implemented

### Signup (Registration)
- ✅ User registration with email, password, name, and role
- ✅ Password hashing using bcrypt (12 rounds)
- ✅ Duplicate email validation
- ✅ JWT token generation upon successful registration
- ✅ Initializes `loginCount` to 0
- ✅ Sets `isActive` to true by default
- ✅ Sets `emailVerified` to false by default

### Login
- ✅ Email and password authentication
- ✅ Password verification using bcrypt
- ✅ Account status check (active/inactive)
- ✅ Updates `lastLogin` timestamp on successful login
- ✅ Increments `loginCount` on successful login
- ✅ Tracks all login attempts in `login_history`:
  - Successful logins
  - Failed logins (wrong password, user not found, inactive account)
  - IP address and user agent tracking
  - Failure reasons for debugging

## 📡 API Endpoints

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "BORROWER"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BORROWER",
    "creditScore": 650,
    "trustScore": 70,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "emailVerified": false
  }
}
```

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BORROWER",
    "creditScore": 650,
    "trustScore": 70,
    "lastLogin": "2024-01-01T12:00:00.000Z",
    "loginCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔍 Querying Login History

You can query login history using MongoDB:

```javascript
// Get all login attempts for a user
db.login_history.find({ userId: "user_id_here" })

// Get failed login attempts
db.login_history.find({ success: false })

// Get recent login attempts
db.login_history.find().sort({ createdAt: -1 }).limit(10)

// Get login attempts by email
db.login_history.find({ email: "user@example.com" })
```

## 🛡️ Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Login Tracking**: All login attempts are logged for security monitoring
4. **IP Tracking**: IP addresses are recorded for security analysis
5. **Account Status**: Ability to deactivate accounts
6. **Failed Login Logging**: Failed attempts are logged with reasons

## 📋 Next Steps

1. **Start the backend server:**
   ```bash
   npm run dev:backend
   ```

2. **Test registration:**
   - Use the frontend registration page or API endpoint
   - Verify user is created in the database

3. **Test login:**
   - Use the frontend login page or API endpoint
   - Verify login history is being tracked

4. **Monitor login history:**
   - Check the `login_history` collection for all login attempts
   - Monitor for suspicious activity (multiple failed attempts, etc.)

## 🔗 Database Connection

**MongoDB Atlas Cluster:** `cluster0.uahidqc.mongodb.net`  
**Database:** `kshetraKredit`  
**Status:** ✅ Connected and configured

## 📚 Additional Resources

- Prisma Schema: `prisma/schema.prisma`
- Auth Controller: `src/backend/controllers/authController.js`
- Auth Routes: `src/backend/routes/authRoutes.js`

---

**Setup completed on:** $(date)  
**Database:** MongoDB Atlas  
**ORM:** Prisma
