# Backend ESP Scan Endpoint

## Overview

The frontend includes an ESP device scanner on the admin dashboard that allows administrators to discover ESP32 devices on the network. This document describes the backend endpoint that needs to be implemented.

## Endpoint

```
POST /api/admin/devices/scan
```

**Authorization**: Requires admin authentication (Bearer token)

**Content-Type**: `application/json`

## Request

No request body required. The endpoint should scan the network for ESP32 devices.

## Response

Returns an array of discovered ESP devices:

```json
[
  {
    "deviceId": "ESP32_001",
    "ip": "192.168.1.100",
    "macAddress": "AA:BB:CC:DD:EE:FF",
    "lastSeen": "2024-01-15T10:30:00Z",
    "isRegistered": true,
    "currentFarmId": 1
  },
  {
    "deviceId": "ESP32_002",
    "ip": "192.168.1.101",
    "macAddress": "AA:BB:CC:DD:EE:FE",
    "lastSeen": "2024-01-15T10:25:00Z",
    "isRegistered": false,
    "currentFarmId": null
  }
]
```

## Response Fields

- **deviceId** (string, required): Unique identifier of the ESP device
- **ip** (string, required): IP address of the device
- **macAddress** (string, optional): MAC address of the device
- **lastSeen** (string, optional): ISO 8601 timestamp of when the device was last seen
- **isRegistered** (boolean, required): Whether the device is registered in the database
- **currentFarmId** (number, optional): The farm ID the device is currently assigned to (if registered)

## Implementation Notes

### Network Scanning Approaches

1. **ARP Table Scanning**: Read the ARP table to find devices on the local network
2. **mDNS/Bonjour**: Use multicast DNS to discover devices that advertise themselves
3. **Port Scanning**: Scan common ports (e.g., 80, 8080) for HTTP responses
4. **Database Lookup**: Check devices that have sent data recently (based on IP addresses from sensor readings)

### Recommended Approach

Since ESP32 devices using DHCP will have their IPs automatically detected when they send sensor data, a practical approach is:

1. Query the database for all devices that have sent data recently (e.g., last 24 hours)
2. Optionally, perform a network scan to discover new devices
3. Combine both results, marking devices as "registered" if they exist in the database

### Example Java Implementation

```java
@PostMapping("/api/admin/devices/scan")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<ScannedEspDto>> scanEspDevices() {
    // Get all devices from database that have sent data recently
    List<Device> registeredDevices = deviceRepository.findAll();
    
    // Optionally: Perform network scan
    // List<NetworkDevice> networkDevices = networkScanner.scan();
    
    // Map to DTO
    List<ScannedEspDto> scannedDevices = registeredDevices.stream()
        .map(device -> {
            ScannedEspDto dto = new ScannedEspDto();
            dto.setDeviceId(device.getDeviceId());
            dto.setIp(device.getIp());
            dto.setMacAddress(device.getMacAddress());
            dto.setIsRegistered(true);
            dto.setCurrentFarmId(device.getFarmId());
            dto.setLastSeen(device.getLastSeen());
            return dto;
        })
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(scannedDevices);
}
```

### DTO Class

```java
public class ScannedEspDto {
    private String deviceId;
    private String ip;
    private String macAddress;
    private String lastSeen;
    private boolean isRegistered;
    private Long currentFarmId;
    
    // Getters and setters...
}
```

## Error Handling

- **401 Unauthorized**: Return if user is not authenticated or not an admin
- **500 Internal Server Error**: Return if scanning fails

## Frontend Integration

The frontend component (`EspScanner`) will:
1. Display a "Scan Network" button
2. Show loading state during scan
3. Display results in a table with device ID, IP, MAC, status, and farm assignment
4. Show error messages if the scan fails

## Security Considerations

- Only admin users should be able to access this endpoint
- Network scanning may be resource-intensive - consider rate limiting
- Consider caching scan results for a short period (e.g., 30 seconds) to prevent abuse

