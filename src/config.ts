// Configuration for switching between local mock data and API
export const config = {
    // Set to true to use local mock data, false to use API
    USE_MOCK_DATA: false,

    // API Base URL for your FastAPI backend
    API_URL: "http://localhost:8000/api/v1",

    // Enable development features
    ENABLE_DEVTOOLS: true,

    // Default pagination settings
    DEFAULT_PAGE_SIZE: 10,

    // Authentication settings
    TOKEN_STORAGE_KEY: "refine-auth",
    USER_STORAGE_KEY: "user",

    // API Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            REGISTER: "/users/register",
            LOGIN: "/users/login",
            TOKEN: "/users/token",
            WHOAMI: "/users/whoami",
        },
        // Users
        USERS: "/users",
        USER_BY_ID: (userId: string) => `/users/${userId}`,
        // Projects
        PROJECTS: "/projects",
        PROJECT_BY_ID: (projectId: string) => `/projects/${projectId}`,
        // File Management
        FILES: {
            LIST: (projectId: string) => `/projects/${projectId}/files`,
            GET_CONTENT: (projectId: string, filePath: string) => `/projects/${projectId}/files/${filePath}`,
            GET_INFO: (projectId: string, filePath: string) => `/projects/${projectId}/files/${filePath}/info`,
            CREATE_OR_WRITE: (projectId: string, filePath: string) => `/projects/${projectId}/files/${filePath}`,
            UPDATE: (projectId: string, filePath: string) => `/projects/${projectId}/files/${filePath}`,
            UPLOAD: (projectId: string, filePath: string) => `/projects/${projectId}/files/${filePath}/upload`,
            DELETE: (projectId: string, filePath: string) => `/projects/${projectId}/files/${filePath}`,
        },
        // Directory Operations
        DIRECTORIES: {
            CREATE: (projectId: string, directoryPath: string) => `/projects/${projectId}/directories/${directoryPath}`,
        },
        // Document Versions
        DOCUMENT_VERSIONS: {
            BASE: "/document-versions",
            BY_ID: (docVersionId: string) => `/document-versions/${docVersionId}`,
            BY_PROJECT: (projectId: string) => `/document-versions/project/${projectId}`,
            CURRENT_BY_PROJECT: (projectId: string) => `/document-versions/project/${projectId}/current`,
        },
        // Project Artifacts
        PROJECT_ARTIFACTS: {
            BASE: "/project-artifacts",
            BY_ID: (artifactId: string) => `/project-artifacts/${artifactId}`,
            BY_PROJECT: (projectId: string) => `/project-artifacts/project/${projectId}`,
            BY_VERSION: (versionId: string) => `/project-artifacts/version/${versionId}`,
            BY_TYPE: (artifactType: string) => `/project-artifacts/type/${artifactType}`,
        },
        // Chat System
        CHAT: {
            SESSIONS: "/chat/sessions",
            SESSION_BY_ID: (sessionId: string) => `/chat/sessions/${sessionId}`,
            MESSAGES: (sessionId: string) => `/chat/sessions/${sessionId}/messages`,
            MESSAGE_BY_SEQ: (sessionId: string, sequenceNum: number) => `/chat/sessions/${sessionId}/messages/${sequenceNum}`,
            STREAM: (sessionId: string) => `/chat/sessions/${sessionId}/messages/stream`,
        },
    },

    // API Documentation URLs
    DOCS: {
        SWAGGER: "http://localhost:8000/docs",
        REDOC: "http://localhost:8000/redoc",
        OPENAPI_SCHEMA: "http://localhost:8000/openapi.json",
    },

    // Default credentials for testing
    DEFAULT_CREDENTIALS: {
        ADMIN: {
            username: "admin",
            password: "admin123",
        },
        TEST: {
            username: "testuser", 
            password: "test123",
        },
    },
};
