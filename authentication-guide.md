# Authentication System Documentation

## Overview

This project implements a robust JWT-based authentication system with the following security features:

- **JWT Tokens**: Stateless JSON Web Token authentication
- **Argon2 Password Hashing**: Industry-standard secure password storage
- **OAuth2 Bearer Token**: Standard OAuth2 implementation for API access
- **Separated User/Credential Storage**: Enhanced security through data separation
- **Role-based Access Control**: Support for user roles and permissions

## Architecture

### 1. Database Models

#### User Model (`app/models/user.py`)
```python
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, nullable=False)
    email: str = Field(unique=True, nullable=False)
    full_name: Optional[str] = None
    notes: Optional[str] = None
    roles: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))
    created_at: datetime
    updated_at: datetime
    
    # Relationship to credentials
    credential: Optional["Credential"] = Relationship(back_populates="user")
```

#### Credential Model (`app/models/credential.py`)
```python
class Credential(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", unique=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    created_at: datetime
    updated_at: datetime
    
    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="credential")
```

### 2. Security Configuration

#### Environment Variables (`.env`)
```env
SECRET_KEY=your-super-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_MINUTES=30
DEBUG=True
DATABASE_URL=sqlite:///./test.db
```

#### Configuration Settings (`app/core/config.py`)
```python
class Settings(BaseSettings):
    secret_key: SecretStr = SecretStr("default-key")
    jwt_algorithm: str = "HS256"
    access_token_expires_minutes: int = 30
    debug: bool = True
```

### 3. Security Functions (`app/core/security.py`)

#### Password Security
- **Library**: Argon2 (memory-hard hashing algorithm)
- **Functions**:
  - `hash_password(password: str) -> str` - Hash a plain password
  - `verify_password(plain_password: str, hashed_password: str) -> bool` - Verify password

#### JWT Token Management
- **Functions**:
  - `create_access_token(data: dict, expires_delta: Optional[timedelta]) -> str`
  - `decode_access_token(token: str) -> dict`

#### User Authentication
- **Function**: `get_current_user(db: Session, token: str) -> User`
- **Purpose**: FastAPI dependency to extract and validate user from JWT token

## Authentication Endpoints

### Base URL
```
http://localhost:8000/api/v1/users
```

### 1. User Registration

```http
POST /register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "secure_password123",
  "full_name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "username": "newuser",
  "email": "user@example.com",
  "full_name": "John Doe",
  "notes": null,
  "roles": [],
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

**Process:**
1. Validate input data (username, email uniqueness)
2. Hash password using Argon2
3. Create User record
4. Create Credential record with hashed password
5. Return user data (password excluded)

**Error Responses:**
- `400 Bad Request`: Username or email already exists
- `422 Unprocessable Entity`: Validation errors

### 2. User Login (JSON Format - Recommended)

```http
POST /token
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

**Process:**
1. Find user by username
2. Retrieve user's credential from database
3. Verify password against hashed password
4. Create JWT token with user ID as subject
5. Return token and token type

### 3. User Login (OAuth2 Format - For Swagger UI)

```http
POST /login
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```
username=admin&password=admin123
```

**Response:** Same as JSON login

### 4. Get Current User Profile

```http
GET /whoami
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "username": "admin",
  "email": "admin@example.com",
  "full_name": "Administrator",
  "notes": null,
  "roles": ["admin"],
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

## JWT Token Structure

### Token Payload
```json
{
  "sub": "user-uuid-here",     // Subject (User ID)
  "exp": 1735689600,          // Expiration timestamp (Unix)
  "iat": 1735686000           // Issued at timestamp (Unix)
}
```

### Token Properties
- **Algorithm**: HS256 (HMAC SHA-256)
- **Expiration**: 30 minutes (configurable)
- **Format**: `Bearer <token>`
- **Header Location**: `Authorization: Bearer <token>`

## Frontend Integration

### JavaScript/TypeScript Example

```javascript
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api/v1';
    this.token = localStorage.getItem('access_token');
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    return response.json();
  }

  async login(username, password) {
    const response = await fetch(`${this.baseURL}/users/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('access_token', this.token);
    return data;
  }

  async getCurrentUser() {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${this.baseURL}/users/whoami`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication expired');
      }
      throw new Error('Failed to get user profile');
    }
    
    return response.json();
  }

  async apiRequest(endpoint, options = {}) {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Authentication expired');
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}
```

### React Context Example

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  const authService = new AuthService();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          authService.token = token;
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setToken(response.access_token);
      
      // Get user profile after successful login
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Protected Routes Implementation

### FastAPI Dependency

```python
# Example protected endpoint
@router.get("/protected-resource")
async def get_protected_resource(
    current_user: User = Depends(get_current_user)
):
    """This endpoint requires authentication"""
    return {
        "message": f"Hello {current_user.username}!",
        "user_id": str(current_user.id),
        "roles": current_user.roles
    }
```

### React Route Protection

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage in App.js
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
</Routes>
```

## Error Handling

### HTTP Status Codes

| Code | Scenario | Description |
|------|----------|-------------|
| `200` | Success | Request successful |
| `201` | Created | User registration successful |
| `400` | Bad Request | Username/email already exists |
| `401` | Unauthorized | Invalid credentials or expired token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `422` | Validation Error | Invalid input data format |
| `500` | Server Error | Internal server error |

### Error Response Format

```json
{
  "detail": "Specific error message"
}
```

### Common Error Scenarios

1. **Invalid Login Credentials**
   ```json
   {
     "detail": "Incorrect username or password"
   }
   ```

2. **Expired/Invalid Token**
   ```json
   {
     "detail": "Could not validate credentials"
   }
   ```

3. **Username Already Exists**
   ```json
   {
     "detail": "Username already registered"
   }
   ```

4. **Validation Errors**
   ```json
   {
     "detail": [
       {
         "loc": ["body", "email"],
         "msg": "field required",
         "type": "value_error.missing"
       }
     ]
   }
   ```

## Security Features

### 1. Password Security
- **Hashing Algorithm**: Argon2id (winner of Password Hashing Competition)
- **Salt Generation**: Automatic per-password salt generation
- **Memory-Hard Function**: Resistant to GPU/ASIC attacks
- **Time Cost**: Configurable computational cost

### 2. JWT Security
- **Stateless**: No server-side session storage required
- **Cryptographic Signing**: Prevents token tampering
- **Expiration**: Automatic token expiration (30 minutes default)
- **Secure Headers**: Proper `WWW-Authenticate` headers

### 3. Database Security
- **Credential Separation**: Passwords stored in separate table
- **No Plain Text**: Passwords never stored in readable format
- **UUID Primary Keys**: Non-sequential, non-predictable IDs
- **Foreign Key Constraints**: Data integrity enforcement

### 4. API Security
- **CORS Configuration**: Proper cross-origin request handling
- **Rate Limiting**: (Can be implemented for production)
- **HTTPS Enforcement**: (Recommended for production)

## Default Test Data

After running database seeding (`python manage.py seed-db`):

| Username | Password | Email | Role |
|----------|----------|-------|------|
| `admin` | `admin123` | `admin@example.com` | Administrator |
| `testuser` | `test123` | `test@example.com` | Test User |

## Testing with cURL

### Register New User
```bash
curl -X POST "http://localhost:8000/api/v1/users/register" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "newuser",
       "email": "newuser@example.com", 
       "password": "securepass123",
       "full_name": "New User"
     }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/v1/users/token" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "admin123"
     }'
```

### Access Protected Endpoint
```bash
# Replace <TOKEN> with actual JWT token from login response
curl -X GET "http://localhost:8000/api/v1/users/whoami" \
     -H "Authorization: Bearer <TOKEN>"
```

## Production Considerations

### 1. Security Hardening

```env
# Production environment variables
SECRET_KEY=super-long-random-secret-key-256-bits-minimum
ACCESS_TOKEN_EXPIRES_MINUTES=15  # Shorter expiration
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
```

### 2. HTTPS Configuration
- Always use HTTPS in production
- Configure SSL/TLS certificates
- Set secure cookie flags
- Enable HSTS headers

### 3. Rate Limiting
```python
# Example rate limiting middleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@router.post("/login")
@limiter.limit("5/minute")  # 5 attempts per minute
async def login_with_rate_limit(request: Request, ...):
    # Login logic
```

### 4. Monitoring & Logging
- Log authentication attempts
- Monitor failed login patterns
- Track token usage
- Set up security alerts

## Troubleshooting

### Common Issues

1. **"Could not validate credentials"**
   - Check token format and expiration
   - Verify SECRET_KEY consistency
   - Ensure Bearer token format

2. **"Username already registered"**
   - User exists in database
   - Check both username AND email uniqueness

3. **CORS Errors**
   - Configure allowed origins in settings
   - Check frontend URL matches allowed hosts

4. **Token Expiration Issues**
   - Implement token refresh mechanism
   - Adjust `ACCESS_TOKEN_EXPIRES_MINUTES`
   - Handle 401 responses gracefully

### Debug Mode Features

When `DEBUG=True`:
- Additional error details in responses
- Enhanced logging output
- Token validation debugging
- Database query logging

## Summary

This authentication system provides:

- ✅ **Secure Password Storage** - Argon2 hashing
- ✅ **Stateless Authentication** - JWT tokens
- ✅ **Standard OAuth2** - Bearer token implementation
- ✅ **Database Security** - Separated user/credential storage
- ✅ **Frontend-Friendly** - JSON API with proper error handling
- ✅ **Production-Ready** - Configurable security settings
- ✅ **Developer-Friendly** - Clear documentation and examples

The system is designed to be secure by default while remaining flexible for various use cases and easy to integrate with modern frontend frameworks.

---

**Last Updated**: August 8, 2025  
**API Version**: v1  
**Authentication Required**: JWT Bearer Token
