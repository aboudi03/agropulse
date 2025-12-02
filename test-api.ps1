# AgroPulse API Test Script
# Replace these with your actual credentials
$USERNAME = "your_username_here"
$PASSWORD = "your_password_here"

Write-Host "=== AgroPulse API Debugger ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "1. Logging in as $USERNAME..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = $USERNAME
        password = $PASSWORD
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "User ID: $($loginResponse.id)" -ForegroundColor Green
    Write-Host "Username: $($loginResponse.username)" -ForegroundColor Green
    Write-Host "Farm ID: $($loginResponse.farmId)" -ForegroundColor Green
    Write-Host "Role: $($loginResponse.role)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Get Devices
Write-Host "2. Fetching devices for your user..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $devices = Invoke-RestMethod -Uri "http://localhost:8080/api/device" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Devices retrieved successfully!" -ForegroundColor Green
    Write-Host "Number of devices: $($devices.Count)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Devices JSON:" -ForegroundColor Cyan
    $devices | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get devices: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Step 3: Get Latest Reading for GREENHOUSE_001
Write-Host "3. Fetching latest reading for GREENHOUSE_001..." -ForegroundColor Yellow
try {
    $reading = Invoke-RestMethod -Uri "http://localhost:8080/api/sensor/GREENHOUSE_001/latest" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Reading retrieved successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Latest Reading JSON:" -ForegroundColor Cyan
    $reading | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get reading: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Step 4: Get All Readings for GREENHOUSE_001
Write-Host "4. Fetching all readings for GREENHOUSE_001..." -ForegroundColor Yellow
try {
    $allReadings = Invoke-RestMethod -Uri "http://localhost:8080/api/sensor/GREENHOUSE_001/all" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Readings retrieved successfully!" -ForegroundColor Green
    Write-Host "Number of readings: $($allReadings.Count)" -ForegroundColor Green
    Write-Host ""
    if ($allReadings.Count -gt 0) {
        Write-Host "All Readings JSON:" -ForegroundColor Cyan
        $allReadings | ConvertTo-Json -Depth 10
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed to get readings: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
