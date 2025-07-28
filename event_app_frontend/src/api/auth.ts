import axios from "axios";
import { createBrowserHistory } from "history";

const BASE_URL = "http://localhost:8000";
const history = createBrowserHistory();

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
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
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setAccessToken = (token: string) => localStorage.setItem("accessToken", token);
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Axios Client
export const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${BASE_URL}/refresh/`, {
          refresh: getRefreshToken(),
        });
        const newAccess = res.data.access;
        setAccessToken(newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return client(originalRequest);
      } catch (refreshErr) {
        clearTokens();
        history.push("/login");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// API functions
export const registerUser = async (payload: RegisterPayload) => {
  const res = await axios.post(`${BASE_URL}/api/user/register/`, payload);
  return res.data;
};

export const verifyUser = async (payload: OtpPayload) => {
  const res = await axios.post(`${BASE_URL}/api/user/verify/`, payload);
  return res.data;
};

export const loginUser = async (payload: LoginPayload): Promise<TokenPair> => {
  const res = await axios.post(`${BASE_URL}/login/`, payload);
  return res.data;
};

export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const res = await axios.post(`${BASE_URL}/refresh/`, { refresh });
  return res.data;
};

export const verifyAccessToken = async (token: string) => {
  const res = await axios.post(`${BASE_URL}/token_health/`, { token });
  return res.data;
};

export const getMe = async (): Promise<any> => {
  const res = await client.get(`/api/user/getme/`);
  return res.data;
};


export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  window.location.href = "/login";
};


