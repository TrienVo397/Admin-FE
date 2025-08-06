import { DataProvider } from "@refinedev/core";
import { TOKEN_KEY } from "./authProvider";

const API_URL = "http://localhost:8000/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

export const apiDataProvider: DataProvider = {
    getApiUrl: () => API_URL,

    // Get list of resources with pagination and filtering
    getList: async ({ resource, pagination, filters, sorters }) => {
        const url = new URL(`${API_URL}/${resource}`);

        // Add pagination
        if (pagination) {
            const current = pagination.current || 1;
            const pageSize = pagination.pageSize || 10;
            url.searchParams.append("skip", String((current - 1) * pageSize));
            url.searchParams.append("limit", String(pageSize));
        }

        // Add filters
        if (filters) {
            filters.forEach((filter) => {
                if (filter.operator === "eq") {
                    url.searchParams.append(filter.field, String(filter.value));
                } else if (filter.operator === "contains") {
                    url.searchParams.append(`${filter.field}_contains`, String(filter.value));
                }
            });
        }

        // Add sorting
        if (sorters && sorters.length > 0) {
            const sortBy = sorters[0];
            url.searchParams.append("sort_by", sortBy.field);
            url.searchParams.append("sort_order", sortBy.order === "asc" ? "asc" : "desc");
        }

        try {
            const response = await fetch(url.toString(), {
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);

            return {
                data: data.items || data, // FastAPI might return {items: [], total: 0}
                total: data.total || data.length,
            };
        } catch (error) {
            console.error(`Error fetching ${resource}:`, error);
            throw error;
        }
    },

    // Get single resource by ID
    getOne: async ({ resource, id }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}/${id}`, {
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error fetching ${resource} ${id}:`, error);
            throw error;
        }
    },

    // Create new resource
    create: async ({ resource, variables }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(variables),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error creating ${resource}:`, error);
            throw error;
        }
    },

    // Update existing resource
    update: async ({ resource, id, variables }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}/${id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(variables),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error updating ${resource} ${id}:`, error);
            throw error;
        }
    },

    // Delete resource
    deleteOne: async ({ resource, id }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            // Delete might return empty response
            if (response.status === 204) {
                return { data: { id } };
            }

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error deleting ${resource} ${id}:`, error);
            throw error;
        }
    },

    // Get many resources by IDs
    getMany: async ({ resource, ids }) => {
        try {
            // If your FastAPI supports batch fetching
            const url = new URL(`${API_URL}/${resource}/batch`);
            url.searchParams.append("ids", ids.join(","));

            const response = await fetch(url.toString(), {
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            // Fallback: fetch individually
            const promises = ids.map(async (id) => {
                const response = await fetch(`${API_URL}/${resource}/${id}`, {
                    headers: getAuthHeaders(),
                });
                return handleResponse(response);
            });

            const data = await Promise.all(promises);
            return { data };
        }
    },

    // Create many resources
    createMany: async ({ resource, variables }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}/batch`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(variables),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error creating multiple ${resource}:`, error);
            throw error;
        }
    },

    // Update many resources
    updateMany: async ({ resource, ids, variables }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}/batch`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ ids, data: variables }),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error updating multiple ${resource}:`, error);
            throw error;
        }
    },

    // Delete many resources
    deleteMany: async ({ resource, ids }) => {
        try {
            const response = await fetch(`${API_URL}/${resource}/batch`, {
                method: "DELETE",
                headers: getAuthHeaders(),
                body: JSON.stringify({ ids }),
            });

            // Delete might return empty response
            if (response.status === 204) {
                return { data: ids.map(id => ({ id })) };
            }

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error deleting multiple ${resource}:`, error);
            throw error;
        }
    },

    // Custom method for any additional API calls
    custom: async ({ url, method = "GET", headers = {}, meta }) => {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    ...getAuthHeaders(),
                    ...headers,
                },
                ...(meta?.body && { body: JSON.stringify(meta.body) }),
            });

            const data = await handleResponse(response);

            return { data };
        } catch (error) {
            console.error(`Error with custom request to ${url}:`, error);
            throw error;
        }
    },
};
