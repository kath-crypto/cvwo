import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout for better error handling
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - maybe redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types for better type safety
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Topics
export const getTopics = () => api.get('/topics/');
export const getTopic = (id: number) => api.get(`/topics/${id}`);
export const createTopic = (data: { title: string; description: string }) => 
  api.post('/topics/', data);
export const updateTopic = (id: number, data: { title: string; description: string }) => 
  api.put(`/topics/${id}`, data);
export const deleteTopic = (id: number) => api.delete(`/topics/${id}`);

// Posts
export const getPosts = (topicId?: number) => 
  api.get('/posts/', { params: { topic_id: topicId } });
export const getPost = (id: number) => api.get(`/posts/${id}`);
export const createPost = (data: { title: string; content: string; topic_id: number }) => 
  api.post('/posts/', data);
export const updatePost = (id: number, data: { title?: string; content?: string }) => 
  api.put(`/posts/${id}`, data);
export const deletePost = (id: number) => api.delete(`/posts/${id}`);

// Comments
export const getComments = (postId: number) => api.get(`/comments/post/${postId}`);
export const createComment = (data: { content: string; post_id: number; parent_id?: number | null }) => 
  api.post('/comments/', data);
export const updateComment = (id: number, data: { content: string }) => 
  api.put(`/comments/${id}`, data);
export const deleteComment = (id: number) => api.delete(`/comments/${id}`);

// Auth
export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
}

export const login = (data: LoginData) => api.post<AuthResponse>('/auth/login', data);
export const register = (data: RegisterData) => api.post<AuthResponse>('/auth/register', data);
export const getProfile = () => api.get<{ id: number; username: string; created_at: string }>('/auth/profile');

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

export default api;