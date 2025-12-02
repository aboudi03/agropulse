export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  farmId: number;
  role?: "USER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  farmId: number;
  role: "USER" | "ADMIN";
  username: string;
}
