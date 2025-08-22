import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    const { response } = error;
    
    if (response && response.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('nexus_auth_token');
      localStorage.removeItem('nexus_user');
      
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Image generation endpoints
export const generateImage = async (params) => {
  try {
    console.log("Making API request to /images/generate with params:", params);
    const response = await apiClient.post('/images/generate', params);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

// Image editing endpoint - FIXED VERSION
export const editImage = async (params) => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    
    // Ensure all parameters are correctly added
    // The 'image' must be first in formData for some servers
    formData.append('image', params.image);
    formData.append('prompt', params.prompt);
    formData.append('model', params.model);
    formData.append('size', params.size);
    
    // Log the formData contents for debugging
    console.log("FormData created with:");
    console.log("- File:", params.image.name, params.image.type, params.image.size);
    console.log("- Prompt:", params.prompt);
    console.log("- Model:", params.model);
    console.log("- Size:", params.size);
    
    // Don't set Content-Type header - axios will set it with correct boundary
    const config = {
      headers: {
        // Let axios set this automatically with boundary
        // 'Content-Type': 'multipart/form-data' 
      }
    };
    
    console.log("Making image edit request to /images/edit");
    const response = await apiClient.post('/images/edit', formData, config);
    console.log("Edit Image API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error editing image:', error);
    throw error;
  }
};

// User auth endpoints
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export default apiClient;