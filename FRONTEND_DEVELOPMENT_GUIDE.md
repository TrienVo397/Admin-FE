# Frontend Development Guide: GenAI Software Testing Platform

## Project Overview
This is a **FastAPI-based backend** for a GenAI-powered software testing assistance platform. The backend provides REST APIs for managing users, projects, documents, artifacts, and chat sessions with AI agents.

## Architecture Summary
- **Framework**: FastAPI with SQLModel (SQLAlchemy + Pydantic)
- **Database**: Relational database with UUID primary keys
- **Authentication**: JWT tokens with OAuth2PasswordBearer
- **API Version**: v1 (base path: `/api/v1/`)

---

## 🔐 Authentication System

### **Authentication Flow**
1. **Register**: `POST /api/v1/users/register`
2. **Login**: `POST /api/v1/users/login` 
3. **Token**: Use Bearer token in Authorization header
4. **Protected Routes**: Most CRUD operations require authentication

### **Token Usage**
```javascript
// Headers for authenticated requests
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

---

## 👤 USER MANAGEMENT

### **User Data Structure**
```typescript
interface User {
  id: string;                    // UUID
  username: string;              // Unique, required
  email: string;                 // Unique, required
  full_name?: string;            // Optional
  notes?: string;                // Optional
  roles?: string[];              // Array: ["admin", "user", "tester", etc.]
  created_at: string;            // ISO datetime
  updated_at: string;            // ISO datetime
}
```

### **User API Endpoints**

#### **1. Register User**
```
POST /api/v1/users/register
Content-Type: application/json

Body:
{
  "username": "john_tester",
  "email": "john@example.com", 
  "password": "secure_password123",
  "full_name": "John Smith"
}

Response: User object (without password)
```

#### **2. Login User**
```
POST /api/v1/users/login
Content-Type: application/x-www-form-urlencoded

Body:
username=john_tester&password=secure_password123

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### **3. Get Current User**
```
GET /api/v1/users/whoami
Authorization: Bearer <token>

Response: Current user object
```

#### **4. Get User by ID**
```
GET /api/v1/users/{user_id}
Authorization: Bearer <token>

Response: User object
```

### **User Form Fields for Frontend**
```typescript
// Registration Form
interface UserRegistrationForm {
  username: string;         // Required, min 3 chars
  email: string;           // Required, valid email
  password: string;        // Required, min 8 chars
  confirmPassword: string; // Must match password
  full_name?: string;      // Optional
}

// Login Form
interface UserLoginForm {
  username: string;        // Required
  password: string;        // Required
}

// Profile Update Form
interface UserUpdateForm {
  full_name?: string;
  notes?: string;
  roles?: string[];        // Multi-select: admin, user, tester, developer, analyst, project_manager, team_lead
}
```

---

## 📁 PROJECT MANAGEMENT

### **Project Data Structure**
```typescript
interface Project {
  id: string;                    // UUID
  name: string;                  // Required, unique
  repo_path?: string;            // Optional file path
  current_version?: string;      // UUID reference to DocumentVersion
  note?: string;                 // Optional description
  meta_data?: string;            // Optional JSON metadata
  start_date?: string;           // ISO datetime
  end_date?: string;             // ISO datetime
  created_at: string;            // ISO datetime
  created_by: string;            // UUID reference to User
  updated_at: string;            // ISO datetime  
  updated_by: string;            // UUID reference to User
}
```

### **Project API Endpoints**

#### **1. Create Project**
```
POST /api/v1/projects/
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "E-commerce Testing Project",
  "meta_data": "Web application testing project",
  "note": "Main testing project for e-commerce platform",
  "start_date": "2025-08-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z"
}

Response: Project object with auto-set created_by/updated_by from token
```

#### **2. Get All Projects**
```
GET /api/v1/projects/
Authorization: Bearer <token>

Response: Array of Project objects
```

#### **3. Get Project by ID**
```
GET /api/v1/projects/{project_id}
Authorization: Bearer <token>

Response: Project object
```

#### **4. Update Project**
```
PUT /api/v1/projects/{project_id}
Authorization: Bearer <token>
Content-Type: application/json

Body: (All fields optional)
{
  "name": "Updated Project Name",
  "note": "Updated description",
  "start_date": "2025-08-15T00:00:00Z",
  "end_date": "2026-01-31T23:59:59Z"
}

Response: Updated Project object
```

#### **5. Delete Project**
```
DELETE /api/v1/projects/{project_id}
Authorization: Bearer <token>

Response: Deleted Project object
```

### **Project Form Fields for Frontend**
```typescript
// Create Project Form
interface ProjectCreateForm {
  name: string;                  // Required, unique validation
  note?: string;                 // Optional textarea
  meta_data?: string;            // Optional textarea for JSON
  start_date?: Date;             // Optional date picker
  end_date?: Date;               // Optional date picker
}

// Update Project Form (same as create but all optional)
interface ProjectUpdateForm {
  name?: string;
  note?: string;
  meta_data?: string;
  start_date?: Date;
  end_date?: Date;
}
```

---

## 🔗 Related Entities (For Context)

### **Document Versions**
- Each project can have multiple document versions
- Projects have a `current_version` pointer
- Tracks version history for project documents

### **Project Artifacts** 
- Generated test artifacts (test cases, requirements, etc.)
- Linked to specific document versions
- Can be deprecated with reasons

### **Chat Sessions**
- AI conversation sessions linked to projects
- Support for LangGraph/LangChain integration
- Message history with streaming support

---

## 🚀 Frontend Implementation Guidelines

### **State Management**
```typescript
// Global state structure
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  };
  users: {
    list: User[];
    current: User | null;
    loading: boolean;
    error: string | null;
  };
  projects: {
    list: Project[];
    current: Project | null;
    loading: boolean;
    error: string | null;
  };
}
```

### **API Service Layer**
```typescript
class ApiService {
  private baseURL = '/api/v1';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // User methods
  async registerUser(userData: UserRegistrationForm): Promise<User> { }
  async loginUser(credentials: UserLoginForm): Promise<{access_token: string, token_type: string}> { }
  async getCurrentUser(): Promise<User> { }
  async getUserById(id: string): Promise<User> { }

  // Project methods
  async createProject(projectData: ProjectCreateForm): Promise<Project> { }
  async getProjects(): Promise<Project[]> { }
  async getProjectById(id: string): Promise<Project> { }
  async updateProject(id: string, projectData: ProjectUpdateForm): Promise<Project> { }
  async deleteProject(id: string): Promise<Project> { }
}
```

### **Form Validation Rules**
```typescript
const validationRules = {
  user: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_]+$/  // Alphanumeric and underscore only
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/  // At least one lowercase, uppercase, and digit
    }
  },
  project: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      unique: true  // Check against existing projects
    },
    dates: {
      startDate: { type: 'date' },
      endDate: { 
        type: 'date',
        mustBeAfter: 'startDate'  // End date must be after start date
      }
    }
  }
};
```

### **Error Handling**
```typescript
interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

// Common error scenarios
const errorScenarios = {
  400: "Bad Request - Validation errors",
  401: "Unauthorized - Invalid or expired token", 
  403: "Forbidden - Insufficient permissions",
  404: "Not Found - Resource doesn't exist",
  409: "Conflict - Username/email/project name already exists",
  422: "Unprocessable Entity - Invalid data format",
  500: "Internal Server Error"
};
```

### **UI Components Needed**

#### **User Management**
- `UserRegistrationForm` - Registration with validation
- `UserLoginForm` - Login form
- `UserProfile` - View/edit user profile
- `UserList` - Admin view of all users

#### **Project Management**
- `ProjectCreateForm` - Create new project
- `ProjectList` - List all projects with search/filter
- `ProjectCard` - Individual project display
- `ProjectEditForm` - Update project details
- `ProjectDeleteConfirmation` - Delete confirmation modal

#### **Common Components**
- `AuthGuard` - Route protection component
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling
- `Toast/Notification` - Success/error messages
- `DatePicker` - Date selection for projects
- `MultiSelect` - Role selection for users

---

## 📝 Sample Data for Testing

Use the provided `sample_user_data.json` for:
- Mock data during development
- API testing scenarios
- Database seeding

### **Sample Users**
- `john_tester` - Senior QA Engineer
- `sarah_qa` - API Testing Specialist  
- `mike_admin` - Platform Administrator
- `emma_dev` - Developer/Tester
- `alex_analyst` - Business Analyst

### **Sample Projects** (for your reference)
```json
[
  {
    "name": "E-commerce Platform Testing",
    "note": "Comprehensive testing for online shopping platform",
    "start_date": "2025-08-01T00:00:00Z",
    "end_date": "2025-12-31T23:59:59Z"
  },
  {
    "name": "Mobile App QA",
    "note": "iOS and Android app testing project", 
    "start_date": "2025-09-01T00:00:00Z"
  },
  {
    "name": "API Integration Testing",
    "note": "Third-party API integration testing",
    "start_date": "2025-08-15T00:00:00Z",
    "end_date": "2025-10-15T23:59:59Z"
  }
]
```

---

## 🔧 Development Notes

1. **Authentication**: Always check token validity before protected operations
2. **Validation**: Implement client-side validation matching backend rules
3. **Error Messages**: Use backend error messages for consistency
4. **Loading States**: Show loading indicators for async operations
5. **Optimistic Updates**: Consider optimistic UI updates for better UX
6. **Caching**: Cache user data and project lists appropriately
7. **Real-time**: Consider WebSocket for chat features (future enhancement)

---

This guide provides everything needed to build a comprehensive frontend for user and project CRUD operations. The backend is well-structured with clear API contracts and proper authentication flow.
