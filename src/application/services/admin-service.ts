import type { AdminRepository } from "../../domain/repositories/admin-repository";
import type { 
  FarmDto, CreateFarmRequest, 
  UserDto, CreateUserRequest, 
  AdminDeviceDto, DeviceAssignmentRequest,
  ScannedEspDto
} from "../dtos/admin-dtos";

export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getFarms(): Promise<FarmDto[]> {
    return this.adminRepository.getFarms();
  }

  async createFarm(data: CreateFarmRequest): Promise<FarmDto> {
    return this.adminRepository.createFarm(data);
  }

  async getUsers(): Promise<UserDto[]> {
    return this.adminRepository.getUsers();
  }

  async createUser(data: CreateUserRequest): Promise<UserDto> {
    return this.adminRepository.createUser(data);
  }

  async getDevices(): Promise<AdminDeviceDto[]> {
    return this.adminRepository.getDevices();
  }

  async getDevicesByFarm(farmId: number): Promise<AdminDeviceDto[]> {
    return this.adminRepository.getDevicesByFarm(farmId);
  }

  async scanEspDevices(): Promise<ScannedEspDto[]> {
    return this.adminRepository.scanEspDevices();
  }

  async assignDevice(data: DeviceAssignmentRequest): Promise<void> {
    return this.adminRepository.assignDevice(data);
  }

  async updateDeviceFarm(deviceId: string, farmId: number): Promise<void> {
    return this.adminRepository.updateDeviceFarm(deviceId, farmId);
  }

  async deleteDevice(deviceId: string): Promise<void> {
    return this.adminRepository.deleteDevice(deviceId);
  }

  async deleteUser(userId: number): Promise<void> {
    return this.adminRepository.deleteUser(userId);
  }

  async deleteFarm(farmId: number): Promise<void> {
    return this.adminRepository.deleteFarm(farmId);
  }
}
