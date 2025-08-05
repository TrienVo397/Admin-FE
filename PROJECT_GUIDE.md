# GenAI Software Testing Platform - Admin Frontend Guide

## 🎯 Project Overview

This is a React-based admin frontend for a GenAI Software Testing Platform built with:
- **Framework**: React + TypeScript
- **UI Library**: Ant Design with Refine.dev
- **Build Tool**: Vite
- **Data Management**: Local data provider (mock data)
- **Backend API**: FastAPI with SQLModel + Pydantic (UUID-based)

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── app-icon/        # Application logo/icon
│   ├── header/          # Header component
│   └── layout/          # Layout wrapper
├── contexts/            # React contexts
│   └── color-mode/      # Dark/light theme context
├── pages/               # Main application pages
│   ├── projects/        # Project management pages
│   │   ├── index.ts     # Exports all project components
│   │   ├── list.tsx     # Project listing with search/filters
│   │   ├── show.tsx     # Project details with metadata
│   │   ├── create.tsx   # Create new project form
│   │   └── edit.tsx     # Edit existing project form
│   └── users/           # User management pages
│       ├── index.ts     # Exports all user components
│       ├── list.tsx     # User listing with roles
│       ├── show.tsx     # User details with role management
│       └── create.tsx   # Create new user form
├── providers/           # Data providers
│   └── localDataProvider.ts  # Mock data provider
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── FRONTEND_DEVELOPMENT_GUIDE.md  # API specifications
├── User json.txt        # Sample user data (UUID format)
└── Project json.txt     # Sample project data (UUID format)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation & Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   - Application runs on `http://localhost:5173` (or next available port)
   - Hot reload enabled for development

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📊 Data Structure

### Users
All users follow UUID-based structure:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "username": "john_tester", 
  "email": "john@example.com",
  "full_name": "John Smith",
  "notes": "Senior QA Engineer with 5+ years experience",
  "roles": ["tester", "team_lead"],
  "created_at": "2025-01-15T08:30:00Z",
  "updated_at": "2025-01-15T08:30:00Z"
}
```

### Projects
All projects follow UUID-based structure:
```json
{
  "id": "proj-550e8400-e29b-41d4-a716-446655440001",
  "name": "E-commerce Platform Testing",
  "note": "Comprehensive testing for online shopping platform",
  "repo_path": "/projects/ecommerce-testing",
  "meta_data": {
    "tech_stack": ["React", "Node.js", "PostgreSQL"],
    "testing_framework": "Selenium + Jest",
    "priority": "high"
  },
  "start_date": "2025-02-01T00:00:00Z",
  "end_date": "2025-04-30T23:59:59Z",
  "created_by": "550e8400-e29b-41d4-a716-446655440001",
  "updated_by": "550e8400-e29b-41d4-a716-446655440001",
  "created_at": "2025-01-20T09:00:00Z",
  "updated_at": "2025-01-20T09:00:00Z"
}
```

## 🎨 Component Features

### Project Management
- **List View**: 
  - Search by name, note, or repository path
  - Status indicators (Active, Planned, Ended based on dates)
  - Repository path display
  - Action buttons (View, Edit, Delete)

- **Show View**:
  - Comprehensive project details with card layout
  - Status indicators with color coding
  - Creator/updater user information lookup
  - Repository path with icon
  - Metadata JSON display with error handling
  - Formatted date displays

- **Create/Edit Forms**:
  - Form validation (name length, JSON format, character limits)
  - Real-time JSON validation for metadata
  - Date picker integration with validation
  - Character counters and helpful placeholders
  - Proper data transformation for API submission

### User Management
- **List View**:
  - Role-based filtering and display
  - User status indicators
  - Search functionality

- **Show View**:
  - Complete user profile information
  - Role management with tags
  - Notes and activity tracking

- **Create Form**:
  - User creation with role assignment
  - Email validation
  - Form validation and error handling

## 🔧 Technical Implementation

### Key Technologies
- **Refine.dev**: Provides data management, routing, and CRUD operations
- **Ant Design**: UI components with consistent styling
- **TypeScript**: Type safety and better development experience
- **dayjs**: Date manipulation and formatting
- **Vite**: Fast build tool and development server

### Data Flow
1. **Data Provider**: `localDataProvider.ts` handles all CRUD operations with mock data
2. **Components**: Use Refine hooks (`useTable`, `useShow`, `useForm`) for data management
3. **Routing**: React Router with Refine bindings for navigation
4. **State Management**: Refine's built-in state management with React Query

### Form Handling
- Date fields are automatically converted to ISO strings on submission
- JSON metadata is validated in real-time
- All forms include comprehensive validation rules
- Character limits and helpful error messages

## 🎯 API Compliance

The frontend is designed to work with a FastAPI backend with these specifications:
- **Base URL**: `/api/v1/`
- **Authentication**: Bearer token (JWT)
- **Primary Keys**: UUID format
- **Date Format**: ISO 8601 strings
- **Error Handling**: Standard HTTP status codes

### Field Mappings
- `description` → `note` (projects)
- `owner_id` → `created_by`/`updated_by`
- Integer IDs → UUID strings
- `is_active` removed (users)
- Added `roles`, `notes` (users)
- Added `repo_path`, `meta_data` (projects)

## 🚨 Important Notes

### Development Considerations
1. **Mock Data**: Currently using local data provider - replace with real API calls when backend is ready
2. **Authentication**: JWT handling is configured but not implemented with real backend
3. **Error Handling**: Basic error handling in place - enhance based on backend error responses
4. **Validation**: Client-side validation matches backend requirements

### File Organization
- All enhanced components are in main `.tsx` files (not `.new.tsx`)
- Each resource has its own `index.ts` for clean imports
- Unused template files have been removed
- TypeScript errors are resolved

### Customization Points
1. **Data Provider**: Update `localDataProvider.ts` to connect to real API
2. **Authentication**: Implement real auth flow in App.tsx
3. **Styling**: Customize Ant Design theme in main CSS
4. **Validation**: Adjust form validation rules based on backend requirements

## 🔄 Common Operations

### Adding New Resources
1. Create new folder in `src/pages/`
2. Add `list.tsx`, `show.tsx`, `create.tsx`, `edit.tsx`
3. Create `index.ts` for exports
4. Add resource configuration in `App.tsx`
5. Update data provider if needed

### Modifying Forms
1. Update field definitions in component
2. Add/modify validation rules
3. Update data transformation in `handleFinish`
4. Test with sample data

### Styling Changes
1. Use Ant Design props for component styling
2. Add custom CSS in component files
3. Modify theme in main CSS if needed

## 📝 Next Steps

When resuming development:
1. **Backend Integration**: Replace mock data provider with real API calls
2. **Authentication**: Implement proper JWT handling and login flow
3. **Error Handling**: Enhance error handling based on backend responses
4. **Testing**: Add unit and integration tests
5. **Performance**: Optimize data loading and caching
6. **Features**: Add more advanced filtering, sorting, and export capabilities

## 🐛 Troubleshooting

### Common Issues
- **TypeScript Errors**: Check import paths and type definitions
- **Form Validation**: Verify field names match backend requirements
- **Date Handling**: Ensure dates are properly formatted for API
- **JSON Metadata**: Validate JSON format before submission

### Development Tips
- Use browser dev tools to inspect network requests
- Check console for TypeScript errors
- Use Refine dev tools for debugging data flow
- Test form validation with various inputs

---

**Last Updated**: August 5, 2025  
**Version**: Enhanced with UUID support and comprehensive validation  
**Status**: Ready for backend integration
