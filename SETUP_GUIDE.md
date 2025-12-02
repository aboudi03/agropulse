# AgroPulse Setup Guide

## Initial Setup: Farms, Users, and Devices

After logging in to AgroPulse, follow these steps to set up your farm and connect your ESP devices.

---

## Step 1: Login as Admin

1. Navigate to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Enter your admin credentials:
   - **Username**: `admin`
   - **Password**: `password` (or whatever your backend uses)
4. Click "Sign In"

---

## Step 2: Access Admin Dashboard

After logging in, navigate to:

```
http://localhost:3000/admin
```

You should see the Admin Console with a sidebar containing:

- Overview
- Farms
- Users
- Devices

---

## Step 3: Create a Farm

1. Click on **"Farms"** in the sidebar
2. In the "Create New Farm" section:
   - Enter a farm name (e.g., "My Greenhouse Farm")
   - Click "Create Farm"
3. Note the **Farm ID** that appears in the table (usually `1` for the first farm)

---

## Step 4: Assign Your ESP Device to the Farm

1. Click on **"Devices"** in the sidebar
2. In the "Assign Device to Farm" section, fill in:
   - **Device ID**: `GHOUSE_01` (match this to your ESP's device ID)
   - **Farm ID**: `1` (the farm you just created)
   - **IP Address**: `172.18.0.1` (optional, but helpful for tracking)
3. Click "Assign Device"

Your device should now appear in the "Registered Devices" table.

---

## Step 5: Verify User Access

1. Click on **"Users"** in the sidebar
2. Find your user account in the list
3. Verify that your user has the correct **Farm ID** (should be `1`)
4. If not, you can create a new user with the correct farm ID:
   - Username: `yourname`
   - Email: `your@email.com`
   - Password: `yourpassword`
   - Farm ID: `1`
   - Role: `USER` or `ADMIN`

---

## Step 6: View Your Dashboard

1. Navigate back to the main dashboard: `http://localhost:3000`
2. You should now see:
   - A device selector dropdown in the top-right (if you have multiple devices)
   - Your ESP device's data displayed
   - Real-time sensor readings

---

## Troubleshooting

### "No devices found" in dashboard

**Cause**: Your user's `farmId` doesn't match the device's `farmId`.

**Solution**:

1. Go to Admin → Users
2. Check your user's Farm ID
3. Go to Admin → Devices
4. Verify the device's Farm ID matches your user's Farm ID

### Device selector not showing

**Cause**: The `/api/device` endpoint is not returning devices for your farm.

**Solution**:

1. Check that your backend filters devices by `farmId`
2. Verify the device is assigned to the correct farm
3. Check browser console for error messages

### "404 Not Found" when accessing admin

**Cause**: You're not logged in as an admin user.

**Solution**:

1. Logout and login with admin credentials
2. Or update your user's role to `ADMIN` in the database

---

## Backend API Reference

### Get Devices for Current User

```bash
GET /api/device
Authorization: Bearer <your_token>

# Should return only devices where device.farmId == user.farmId
```

### Assign Device (Admin Only)

```bash
POST /api/admin/devices/assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "deviceId": "GHOUSE_01",
  "farmId": 1,
  "ip": "172.18.0.1"
}
```

### Create Farm (Admin Only)

```bash
POST /api/admin/farms
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "My Greenhouse Farm"
}
```

---

## Quick SQL Setup (If Needed)

If you need to manually set up the database:

```sql
-- Create a farm
INSERT INTO farms (id, name, created_at) VALUES (1, 'My Farm', NOW());

-- Update user to belong to farm
UPDATE users SET farm_id = 1 WHERE username = 'your_username';

-- Assign device to farm
UPDATE devices SET farm_id = 1 WHERE device_id = 'GHOUSE_01';
```

---

## Next Steps

Once your farm and devices are set up:

1. ✅ Monitor real-time sensor data on the dashboard
2. ✅ Switch between devices using the dropdown selector
3. ✅ Request fresh readings from your ESP
4. ✅ View historical data in charts and tables

For security best practices, see [SECURITY.md](file:///c:/Users/aboud/Desktop/Neu/Projects/AgroPulse/Frontend/agropulse/SECURITY.md).
