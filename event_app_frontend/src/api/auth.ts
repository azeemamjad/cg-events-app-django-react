import axios from "axios";
import { createBrowserHistory } from "history";

const BASE_URL = "http://localhost:8000";
const history = createBrowserHistory();

export interface RegisterPayload {
  profile_picture: File | null;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  confirm_password: string;
  role: string;
}

export interface ExtendedRegisterPayload extends RegisterPayload {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  profilePicture?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface OtpPayload {
  email: string;
  otp?: string;
}

// Token Utilities
const getAccessToken = (): string | null => localStorage.getItem("accessToken");
const getRefreshToken = (): string | null => localStorage.getItem("refreshToken");

const setTokens = (tokens: TokenPair): void => {
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);
};

const setAccessToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// Navigation utility
const navigateToLogin = (): void => {
  clearTokens();
  // Use both history and window.location for better compatibility
  try {
    history.push("/login");
  } catch (error) {
    console.warn("History navigation failed, using window.location", error);
  }
  window.location.href = "/login";
};

// Token validation utility
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; // Treat invalid tokens as expired
  }
};

// Refresh token utility
const performTokenRefresh = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    console.warn("No refresh token available");
    return null;
  }

  // Check if refresh token is expired
  if (isTokenExpired(refreshToken)) {
    console.warn("Refresh token is expired");
    navigateToLogin();
    return null;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/refresh/`,
      { refresh: refreshToken },
      { timeout: 10000 } // 10 second timeout
    );
    
    const newAccessToken = response.data.access;
    setAccessToken(newAccessToken);
    console.log("Token refreshed successfully");
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    
    // Check if it's a 401 or token-related error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        console.warn("Refresh token is invalid or expired");
        navigateToLogin();
      }
    }
    
    return null;
  }
};

// Axios Client
export const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        console.warn("Access token is expired, will attempt refresh");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await performTokenRefresh();
        
        if (newAccessToken) {
          // Update the authorization header and retry the request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        navigateToLogin();
        return Promise.reject(refreshError);
      }
    }

    // If we get here, either:
    // 1. It's not a 401 error
    // 2. We already tried to refresh
    // 3. We don't have a refresh token
    // 4. The refresh failed
    if (error.response?.status === 401) {
      console.warn("Authentication failed, redirecting to login");
      navigateToLogin();
    }

    return Promise.reject(error);
  }
);

// API functions
export const registerUser = async (payload: RegisterPayload) => {
  const formData = new FormData();
  for (const key in payload) {
    if ((payload as any)[key] == null) {
      continue;
    }
    formData.append(key, (payload as any)[key]);
  }
  
  const response = await axios.post(`${BASE_URL}/api/user/register/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000
  });
  return response.data;
};

export const verifyUser = async (payload: OtpPayload) => {
  const response = await axios.post(`${BASE_URL}/api/user/verify/`, payload);
  return response.data;
};

export const loginUser = async (payload: LoginPayload): Promise<TokenPair> => {
  const response = await axios.post(`${BASE_URL}/login/`, payload);
  const tokens = response.data;
  
  // Store tokens after successful login
  setTokens(tokens);
  
  return tokens;
};

export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await axios.post(`${BASE_URL}/refresh/`, { refresh });
  return response.data;
};

export const verifyAccessToken = async (token: string) => {
  const response = await axios.post(`${BASE_URL}/token_health/`, { token });
  return response.data;
};

export const getMe = async (): Promise<any> => {
  try {
    const response = await client.get(`/api/user/getme/`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user data:", error);
    throw error;
  }
};

export const logoutUser = (): void => {
  console.log("Logging out user");
  navigateToLogin();
};

// Utility function to check authentication status
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  if (!accessToken || !refreshToken) {
    return false;
  }
  
  // If access token is not expired, user is authenticated
  if (!isTokenExpired(accessToken)) {
    return true;
  }
  
  // If access token is expired but refresh token is valid, 
  // user can potentially be re-authenticated
  return !isTokenExpired(refreshToken);
};

// Function to ensure user is authenticated before making API calls
export const ensureAuthenticated = async (): Promise<boolean> => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    navigateToLogin();
    return false;
  }
  
  if (!accessToken || isTokenExpired(accessToken)) {
    const newToken = await performTokenRefresh();
    return newToken !== null;
  }
  
  return true;
};

export default client;