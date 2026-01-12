import { httpClient } from "../../infrastructure/http/http-client";
import type { AdminRepository } from "../../domain/repositories/admin-repository";
import type {
  FarmDto,
  CreateFarmRequest,
  UserDto,
  CreateUserRequest,
  AdminDeviceDto,
  DeviceAssignmentRequest,
  ScannedEspDto,
} from "../../application/dtos/admin-dtos";

export class HttpAdminRepository implements AdminRepository {
  async getFarms(): Promise<FarmDto[]> {
    return httpClient<FarmDto[]>({
      path: "/api/admin/farms",
      method: "GET",
    });
  }

  async createFarm(data: CreateFarmRequest): Promise<FarmDto> {
    return httpClient<FarmDto>({
      path: "/api/admin/farms",
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUsers(): Promise<UserDto[]> {
    return httpClient<UserDto[]>({
      path: "/api/admin/users",
      method: "GET",
    });
  }

  async createUser(data: CreateUserRequest): Promise<UserDto> {
    return httpClient<UserDto>({
      path: "/api/admin/users",
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(userId: number, data: Partial<{ email: string; farmId: number; role: string }>): Promise<UserDto> {
    return httpClient<UserDto>({
      path: `/api/admin/users/${userId}`,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getDevices(): Promise<AdminDeviceDto[]> {
    return httpClient<AdminDeviceDto[]>({
      path: "/api/admin/devices",
      method: "GET",
    });
  }

  async getDevicesByFarm(farmId: number): Promise<AdminDeviceDto[]> {
    return httpClient<AdminDeviceDto[]>({
      path: `/api/admin/devices?farmId=${farmId}`,
      method: "GET",
    });
  }

  async scanEspDevices(): Promise<ScannedEspDto[]> {
    return httpClient<ScannedEspDto[]>({
      path: "/api/admin/devices/scan",
      method: "POST",
    });
  }

  async assignDevice(data: DeviceAssignmentRequest): Promise<void> {
    return httpClient<void>({
      path: "/api/admin/devices/assign",
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDeviceFarm(deviceId: string, farmId: number): Promise<void> {
    // Reuse the existing assign endpoint for updating farm assignment.
    // Backend can treat this as an upsert for the device's farm.
    const payload: DeviceAssignmentRequest = { deviceId, farmId };
    return this.assignDevice(payload);
  }

  async deleteDevice(deviceId: string): Promise<void> {
    return httpClient<void>({
      path: `/api/admin/devices/${deviceId}`,
      method: "DELETE",
    });
  }

  async deleteUser(userId: number): Promise<void> {
    return httpClient<void>({
      path: `/api/admin/users/${userId}`,
      method: "DELETE",
    });
  }

  async deleteFarm(farmId: number): Promise<void> {
    return httpClient<void>({
      path: `/api/admin/farms/${farmId}`,
      method: "DELETE",
    });
  }
}
