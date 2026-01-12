import type { 
  FarmDto, CreateFarmRequest, 
  UserDto, CreateUserRequest, 
  AdminDeviceDto, DeviceAssignmentRequest,
  ScannedEspDto
} from "../../application/dtos/admin-dtos";

export interface AdminRepository {
  getFarms(): Promise<FarmDto[]>;
  createFarm(data: CreateFarmRequest): Promise<FarmDto>;
  deleteFarm(farmId: number): Promise<void>;
  
  getUsers(): Promise<UserDto[]>;
  createUser(data: CreateUserRequest): Promise<UserDto>;
  updateUser(userId: number, data: Partial<{ email: string; farmId: number; role: string }>): Promise<UserDto>;
  deleteUser(userId: number): Promise<void>;
  
  getDevices(): Promise<AdminDeviceDto[]>;
  getDevicesByFarm(farmId: number): Promise<AdminDeviceDto[]>;
  scanEspDevices(): Promise<ScannedEspDto[]>;
  assignDevice(data: DeviceAssignmentRequest): Promise<void>;
  updateDeviceFarm(deviceId: string, farmId: number): Promise<void>;
  deleteDevice(deviceId: string): Promise<void>;
}
