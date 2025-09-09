import { AuthBindings } from "@refinedev/core";
import { notification } from "antd";
import { config } from "../config";

export const TOKEN_KEY = config.TOKEN_STORAGE_KEY;

// Use the configured API URL
const API_URL = config.API_URL;

export const authProvider: AuthBindings = {
    login: async ({ username, email, password }) => {
        try {
            // Use the correct admin login endpoint and format
            // Send as application/x-www-form-urlencoded with username and password fields
            const formBody = new URLSearchParams();
            if (email) {
                formBody.append("username", email);
            } else {
                formBody.append("username", username);
            }
            formBody.append("password", password);

            const loginUrl = `${API_URL}/admin/login`;
            console.log('Login URL:', loginUrl);
            console.log('Form data:', formBody.toString());

            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful, response data:', data);
                // Store the access token and admin info
                localStorage.setItem(TOKEN_KEY, data.access_token);
                localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify({
                    admin_id: data.admin_id,
                    admin_username: data.admin_username,
                    token_type: data.token_type,
                }));

                notification.success({
                    message: "Login Successful",
                    description: "Welcome to GenAI Testing Platform!",
                });

                return {
                    success: true,
                    redirectTo: "/",
                };
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                console.log('Login failed, error data:', errorData);
                console.log('Response status:', response.status);
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
            // Validate token with admin endpoint
            try {
                const response = await fetch(`${API_URL}/admin/whoami`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const adminData = await response.json();
                    localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(adminData));
                    return {
                        authenticated: true,
                    };
                } else {
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(config.USER_STORAGE_KEY);
                    return {
                        authenticated: false,
                        redirectTo: "/login",
                    };
                }
            } catch (error) {
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
