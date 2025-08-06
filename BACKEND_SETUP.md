# Backend Integration Setup Guide

## 🔧 Quick Setup for Backend Authentication

### Step 1: Configure the Application

1. **Open** `src/config.ts`
2. **Change** `USE_MOCK_DATA` from `true` to `false`:
   ```typescript
   export const config = {
     USE_MOCK_DATA: false, // Set to false to use backend API
     API_URL: "http://localhost:8000/api/v1", // Update to your backend URL
     // ... other settings
   };
   ```

### Step 2: Update Backend URL

Make sure the `API_URL` in `src/config.ts` matches your FastAPI backend URL:
```typescript
API_URL: "http://localhost:8000/api/v1", // Your actual backend URL
```

### Step 3: Verify Backend Endpoints

Your FastAPI backend should have these endpoints:

#### Authentication Endpoints:
- `POST /api/v1/auth/login` - Login with username/password
- `POST /api/v1/auth/logout` - Logout (optional)
- `GET /api/v1/auth/me` - Get current user info

#### Resource Endpoints:
- `GET /api/v1/users` - List users
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/{id}` - Get project by ID
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

### Step 4: Login Credentials

When the login page appears, use the credentials that work with your FastAPI backend. The form expects:
- **Email/Username**: Your backend username
- **Password**: Your backend password

### Step 5: Testing the Connection

1. **Start your FastAPI backend** (usually `uvicorn main:app --reload`)
2. **Start the frontend** (`npm run dev`)
3. **Navigate to** `http://localhost:5173`
4. **You should see a login page**
5. **Enter your credentials** and login

## 🔄 Switching Back to Mock Data

If you want to test without the backend:

1. **Open** `src/config.ts`
2. **Change** `USE_MOCK_DATA` to `true`:
   ```typescript
   USE_MOCK_DATA: true, // Use local mock data
   ```
3. **Refresh the page** - you'll see the app without login

## 🚨 Common Issues

### "Network error" on login
- Check if your FastAPI backend is running
- Verify the API_URL in config.ts matches your backend
- Check browser dev tools Network tab for specific errors

### CORS errors
- Add CORS middleware to your FastAPI backend:
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### Authentication endpoints don't match
- Update the endpoint URLs in `src/providers/authProvider.ts`
- Check your FastAPI authentication route names

## 📝 Backend Response Format

Your FastAPI endpoints should return data in this format:

### Login Response:
```json
{
  "access_token": "your-jwt-token",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "roles": ["admin", "user"]
  }
}
```

### List Response:
```json
{
  "items": [...], // Array of resources
  "total": 100   // Total count for pagination
}
```

Or just return the array directly:
```json
[...] // Array of resources
```

### Single Resource Response:
```json
{
  "id": "uuid-here",
  "name": "Resource Name",
  // ... other fields
}
```

That's it! Your frontend should now connect to your FastAPI backend. 🎉
