import type { LoginRequest, RegisterRequest, AuthResponse } from "../../application/dtos/auth-dtos";

export interface AuthRepository {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<AuthResponse>;
}
