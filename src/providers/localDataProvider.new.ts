import { DataProvider } from "@refinedev/core";

// Define the data directly from your JSON
const initialUsers = [
  {
    id: 1,
    username: "john_doe",
    email: "john.doe@example.com",
    full_name: "John Doe",
    is_active: true,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z"
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane.smith@example.com",
    full_name: "Jane Smith",
    is_active: true,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z"
  },
  {
    id: 3,
    username: "bob_wilson",
    email: "bob.wilson@example.com",
    full_name: "Bob Wilson",
    is_active: true,
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-17T10:00:00Z"
  },
  {
    id: 4,
    username: "alice_johnson",
    email: "alice.johnson@example.com",
    full_name: "Alice Johnson",
    is_active: false,
    created_at: "2024-01-18T11:45:00Z",
    updated_at: "2024-01-20T14:30:00Z"
  },
  {
    id: 5,
    username: "charlie_brown",
    email: "charlie.brown@example.com",
    full_name: "Charlie Brown",
    is_active: true,
    created_at: "2024-01-19T13:20:00Z",
    updated_at: "2024-01-19T13:20:00Z"
  }
];

const initialProjects = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "E-Commerce Web Application",
    description: "Full-stack e-commerce platform with React frontend and Node.js backend",
    owner_id: 1,
    is_active: true,
    created_at: "2024-01-15T09:30:00Z",
    updated_at: "2024-08-01T14:22:00Z",
    status: "active"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Mobile Banking App",
    description: "Secure mobile banking application for iOS and Android",
    owner_id: 2,
    is_active: true,
    created_at: "2024-01-20T10:15:00Z",
    updated_at: "2024-07-28T16:45:00Z",
    status: "in_development"
  }
];

// Create in-memory store
let users = [...initialUsers];
let projects = [...initialProjects];

export const localDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    let data: any[] = [];
    
    if (resource === 'users') {
      data = [...users];
    } else if (resource === 'projects') {
      data = [...projects];
    }
    
    // Apply filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ('field' in filter && filter.value) {
          data = data.filter((item) => {
            const value = item[filter.field];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(filter.value.toLowerCase());
            }
            return value === filter.value;
          });
        }
      });
    }
    
    // Apply pagination
    const { current = 1, pageSize = 10 } = pagination || {};
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);
    
    return {
      data: paginatedData,
      total: data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    let data: any[] = [];
    
    if (resource === 'users') {
      data = users;
    } else if (resource === 'projects') {
      data = projects;
    }
    
    const item = data.find(item => item.id.toString() === id.toString());
    
    if (!item) {
      throw new Error(`${resource} with id ${id} not found`);
    }
    
    return { data: item };
  },

  create: async ({ resource, variables }) => {
    let newItem: any;
    
    if (resource === 'users') {
      newItem = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...variables,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users.push(newItem);
    } else if (resource === 'projects') {
      newItem = {
        id: `550e8400-e29b-41d4-a716-${Date.now()}`,
        ...variables,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      projects.push(newItem);
    }
    
    return { data: newItem };
  },

  update: async ({ resource, id, variables }) => {
    let data: any[] = [];
    
    if (resource === 'users') {
      data = users;
    } else if (resource === 'projects') {
      data = projects;
    }
    
    const index = data.findIndex(item => item.id.toString() === id.toString());
    
    if (index === -1) {
      throw new Error(`${resource} with id ${id} not found`);
    }
    
    const updatedItem = {
      ...data[index],
      ...variables,
      updated_at: new Date().toISOString(),
    };
    
    data[index] = updatedItem;
    
    return { data: updatedItem };
  },

  deleteOne: async ({ resource, id }) => {
    let deletedItem: any;
    
    if (resource === 'users') {
      deletedItem = users.find(item => item.id.toString() === id.toString());
      users = users.filter(item => item.id.toString() !== id.toString());
    } else if (resource === 'projects') {
      deletedItem = projects.find(item => item.id.toString() === id.toString());
      projects = projects.filter(item => item.id.toString() !== id.toString());
    }
    
    return { data: deletedItem };
  },

  getApiUrl: () => '',
};
