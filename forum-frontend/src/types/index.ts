export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  user_id: number;
  user?: User;
  created_at: string;
  post_count: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  topic_id: number;
  topic?: Topic;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
  comment_count: number;
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  user?: User;
  parent_id?: number | null;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
}

export interface CreateTopicRequest {
  title: string;
  description: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  topic_id: number;
}

export interface CreateCommentRequest {
  content: string;
  post_id: number;
  parent_id?: number | null;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

export interface UpdateCommentRequest {
  content: string;
}