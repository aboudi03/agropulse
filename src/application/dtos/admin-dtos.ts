export interface FarmDto {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateFarmRequest {
  name: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  farmId: number;
  role: "USER" | "ADMIN";
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  farmId: number;
  role?: "USER" | "ADMIN";
}

export interface DeviceAssignmentRequest {
  deviceId: string;
  farmId: number;
  /**
   * IP address is optional and auto-detected by the backend from incoming requests.
   * The backend automatically reads the sender's IP when the ESP32 device sends data.
   */
  ip?: string;
}

export interface AdminDeviceDto {
  deviceId: string;
  ip?: string;
  farmId: number;
}

export interface ScannedEspDto {
  deviceId: string;
  ip: string;
  macAddress?: string;
  lastSeen?: string;
  isRegistered: boolean;
  currentFarmId?: number;
}
