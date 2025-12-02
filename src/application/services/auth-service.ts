import type { AuthRepository } from "../../domain/repositories/auth-repository";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../dtos/auth-dtos";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.authRepository.login(credentials);
    if (response.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("auth_user", JSON.stringify(response));
      }
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.authRepository.register(data);
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }

  getCurrentUser(): AuthResponse | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        return JSON.parse(userStr) as AuthResponse;
      }
    }
    return null;
  }
}
