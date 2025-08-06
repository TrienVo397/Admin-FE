import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";

export const TOKEN_KEY = "refine-auth";

// Backend API base URL - update this to match your FastAPI backend
const API_URL = "http://localhost:8000/api/v1";

export const authProvider: AuthBindings = {
    login: async ({ email, password }) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email, // FastAPI typically uses username field
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Store the access token
                localStorage.setItem(TOKEN_KEY, data.access_token);

                // Optionally store user info
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                notification.success({
                    message: "Login Successful",
                    description: "Welcome to SkyTest Admin Panel!",
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
        // Optional: Call logout endpoint on backend
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }
        } catch (error) {
            console.log("Logout error:", error);
        }

        // Clear local storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("user");

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
            // Optional: Verify token with backend
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    return {
                        authenticated: true,
                    };
                } else {
                    // Token is invalid, remove it
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem("user");
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
        const user = localStorage.getItem("user");
        if (user) {
            const userData = JSON.parse(user);
            return userData.roles || [];
        }
        return [];
    },

    getIdentity: async () => {
        const user = localStorage.getItem("user");
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
            localStorage.removeItem("user");

            return {
                logout: true,
                redirectTo: "/login",
            };
        }

        return { error };
    },
};
