// Configuration for switching between local mock data and API
export const config = {
    // Set to true to use local mock data, false to use API
    USE_MOCK_DATA: true,

    // API Base URL for your FastAPI backend
    API_URL: "http://localhost:8000/api/v1",

    // Enable development features
    ENABLE_DEVTOOLS: true,

    // Default pagination settings
    DEFAULT_PAGE_SIZE: 10,

    // Authentication settings
    TOKEN_STORAGE_KEY: "refine-auth",
    USER_STORAGE_KEY: "user",
};
