import { httpClient } from "../../infrastructure/http/http-client";
import type { AuthRepository } from "../../domain/repositories/auth-repository";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../../application/dtos/auth-dtos";

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return httpClient<AuthResponse>({
      path: "/api/auth/login",
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return httpClient<any>({
      path: "/api/auth/register",
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
