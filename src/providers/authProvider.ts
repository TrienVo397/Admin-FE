import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import { config } from "../config";

export const TOKEN_KEY = config.TOKEN_STORAGE_KEY;

// Use the configured API URL
const API_URL = config.API_URL;

export const authProvider: AuthBindings = {
    login: async ({ username, password }) => {
        try {
            // Use the correct FastAPI login endpoint
            const response = await fetch(`${API_URL}/users/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username, // FastAPI uses username field for login
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Store the access token
                localStorage.setItem(TOKEN_KEY, data.access_token);

                // Get user profile after successful login
                try {
                    const userResponse = await fetch(`${API_URL}/users/whoami`, {
                        headers: {
                            "Authorization": `Bearer ${data.access_token}`,
                        },
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(userData));
                    }
                } catch (error) {
                    console.warn("Could not fetch user profile:", error);
                }

                notification.success({
                    message: "Login Successful",
                    description: "Welcome to GenAI Testing Platform!",
                });

                return {
                    success: true,
                    redirectTo: "/",
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    error: {
                        name: "LoginError",
                        message: errorData.detail || "Invalid credentials",
                    },
                };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: "Network error. Please check if the backend is running.",
                },
            };
        }
    },

    logout: async () => {
        // FastAPI doesn't have a logout endpoint (JWT is stateless)
        // Just clear local storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(config.USER_STORAGE_KEY);

        notification.success({
            message: "Logged Out",
            description: "You have been successfully logged out.",
        });

        return {
            success: true,
            redirectTo: "/login",
        };
    },

    check: async () => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
            // Verify token with FastAPI whoami endpoint
            try {
                const response = await fetch(`${API_URL}/users/whoami`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    // Update stored user data
                    localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(userData));
                    
                    return {
                        authenticated: true,
                    };
                } else {
                    // Token is invalid, remove it
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(config.USER_STORAGE_KEY);
                    return {
                        authenticated: false,
                        redirectTo: "/login",
                    };
                }
            } catch (error) {
                // Network error, assume token is valid for offline usage
                return {
                    authenticated: true,
                };
            }
        }

        return {
            authenticated: false,
            redirectTo: "/login",
        };
    },

    getPermissions: async () => {
        const user = localStorage.getItem(config.USER_STORAGE_KEY);
        if (user) {
            const userData = JSON.parse(user);
            return userData.roles || [];
        }
        return [];
    },

    getIdentity: async () => {
        const user = localStorage.getItem(config.USER_STORAGE_KEY);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    },

    onError: async (error) => {
        console.error(error);

        // Handle 401 Unauthorized errors
        if (error.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(config.USER_STORAGE_KEY);

            return {
                logout: true,
                redirectTo: "/login",
            };
        }

        return { error };
    },
};
