# Backend Implementation Guide: Device Selector

## Quick Start: Add the `/api/devices` Endpoint

The frontend device selector is ready, but your backend needs to implement the `GET /api/devices` endpoint.

### Step 1: Create Device Entity (if not exists)

```java
// Device.java
package com.agropulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "devices")
public class Device {
    @Id
    @Column(name = "device_id")
    private String deviceId;

    private String name;
    private String location;

    @Column(name = "farm_id")
    private Long farmId;  // For future multi-tenant support

    @Column(name = "user_id")
    private Long userId;  // Owner of the device

    // Constructors, getters, setters
    public Device() {}

    public Device(String deviceId, String name, String location) {
        this.deviceId = deviceId;
        this.name = name;
        this.location = location;
    }

    // Getters and setters...
}
```

### Step 2: Create Device DTO

```java
// DeviceDto.java
package com.agropulse.dto;

public class DeviceDto {
    private String deviceId;
    private String name;
    private String location;
    private Long farmId;

    // Constructors
    public DeviceDto() {}

    public DeviceDto(String deviceId, String name, String location) {
        this.deviceId = deviceId;
        this.name = name;
        this.location = location;
    }

    // Getters and setters...
}
```

### Step 3: Create Device Repository

```java
// DeviceRepository.java
package com.agropulse.repository;

import com.agropulse.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    // For future: filter by user
    List<Device> findByUserId(Long userId);

    // For future: filter by farm
    List<Device> findByFarmId(Long farmId);
}
```

### Step 4: Add Controller Endpoint

```java
// SensorController.java (add this method)
@RestController
@RequestMapping("/api")
public class SensorController {

    @Autowired
    private DeviceRepository deviceRepository;

    /**
     * Get all devices
     * TODO: Add authentication and filter by user
     */
    @GetMapping("/devices")
    public List<DeviceDto> getDevices() {
        return deviceRepository.findAll()
            .stream()
            .map(device -> new DeviceDto(
                device.getDeviceId(),
                device.getName(),
                device.getLocation()
            ))
            .collect(Collectors.toList());
    }

    // ... existing methods
}
```

### Step 5: Auto-Register Devices (Optional)

Automatically create device entries when sensor data is received:

```java
// In your sensor data endpoint
@PostMapping("/sensor/add")
public ResponseEntity<?> addSensorData(@RequestBody SensorDataDto data,
                                       HttpServletRequest request) {
    // Get device ID from request
    String deviceId = data.getDeviceId();

    // Auto-register device if it doesn't exist
    if (!deviceRepository.existsById(deviceId)) {
        Device newDevice = new Device();
        newDevice.setDeviceId(deviceId);
        newDevice.setName(deviceId); // Use deviceId as default name
        newDevice.setLocation("Unknown"); // Default location
        deviceRepository.save(newDevice);
    }

    // ... rest of your sensor data logic
}
```

### Step 6: Test the Endpoint

```bash
# Test GET /api/devices
curl http://localhost:8080/api/devices

# Expected response:
# [
#   {
#     "deviceId": "GREENHOUSE_001",
#     "name": "Greenhouse 1",
#     "location": "North Field"
#   },
#   {
#     "deviceId": "GREENHOUSE_002",
#     "name": "Greenhouse 2",
#     "location": "South Field"
#   }
# ]
```

### Step 7: Add Sample Devices (Optional)

Create a data initializer to add sample devices:

```java
// DataInitializer.java
package com.agropulse.config;

import com.agropulse.model.Device;
import com.agropulse.repository.DeviceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDevices(DeviceRepository deviceRepository) {
        return args -> {
            if (deviceRepository.count() == 0) {
                deviceRepository.save(new Device("GREENHOUSE_001", "Greenhouse 1", "North Field"));
                deviceRepository.save(new Device("GREENHOUSE_002", "Greenhouse 2", "South Field"));
                deviceRepository.save(new Device("GREENHOUSE_003", "Greenhouse 3", "East Field"));
                System.out.println("✅ Sample devices initialized");
            }
        };
    }
}
```

---

## What Happens After Implementation

Once you implement the `/api/devices` endpoint:

1. **Frontend will fetch devices** on dashboard load
2. **Device selector dropdown will appear** in the top-right of the dashboard header
3. **Users can switch between devices** using the dropdown
4. **Dashboard data updates** automatically when device is changed

---

## Future: Add Security (Multi-Tenant)

See `SECURITY.md` for detailed implementation guide on:

- User authentication
- Device ownership validation
- Authorization checks
- Preventing cross-farm access

---

## Troubleshooting

**Device selector still not showing?**

1. Check browser console for errors
2. Verify `/api/devices` returns 200 status
3. Ensure response is an array of objects with `deviceId` field
4. Check CORS configuration allows frontend requests

**Single device shows as text instead of dropdown?**

- This is intentional! When only one device exists, it shows as read-only text
- Add more devices to see the dropdown selector
