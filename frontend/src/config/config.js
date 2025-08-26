// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: "http://localhost:5000/api",
    SOCKET_URL: "http://localhost:5000",
  },
  production: {
    API_BASE_URL: "https://your-domain.com/api", // Replace with your Hostinger domain
    SOCKET_URL: "https://your-domain.com", // Replace with your Hostinger domain
  },
};

// Get current environment
const env = import.meta.env.MODE || "development";

// Export current config
export const currentConfig = config[env];

// Export individual values
export const API_BASE_URL = currentConfig.API_BASE_URL;
export const SOCKET_URL = currentConfig.SOCKET_URL;
