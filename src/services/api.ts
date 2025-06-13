const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cybernx-backend.onrender.com/api/v1";

// Fetch API configuration
const api = {
  fetch: async (endpoint: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  
  // GET request
  get: async (endpoint: string, options: RequestInit = {}) => {
    return api.fetch(endpoint, { ...options, method: "GET" });
  },
  
  // POST request
  post: async (endpoint: string, data: any, options: RequestInit = {}) => {
    return api.fetch(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  // PUT request
  put: async (endpoint: string, data: any, options: RequestInit = {}) => {
    return api.fetch(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  
  // DELETE request
  delete: async (endpoint: string, options: RequestInit = {}) => {
    return api.fetch(endpoint, { ...options, method: "DELETE" });
  },
};

export default api;