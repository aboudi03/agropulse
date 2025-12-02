"use client";

import { useState, useEffect } from "react";
import { AdminService } from "../../../application/services/admin-service";
import { HttpAdminRepository } from "../../../infrastructure/repositories/http-admin-repository";
import type { ScannedEspDto, AdminDeviceDto, FarmDto } from "../../../application/dtos/admin-dtos";

export function EspScanner() {
  const [scannedDevices, setScannedDevices] = useState<ScannedEspDto[]>([]);
  const [registeredDevices, setRegisteredDevices] = useState<AdminDeviceDto[]>([]);
  const [farms, setFarms] = useState<FarmDto[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [registeringDeviceId, setRegisteringDeviceId] = useState<string | null>(null);
  const [showRegisteredOnly, setShowRegisteredOnly] = useState(false);

  const adminService = new AdminService(new HttpAdminRepository());

  useEffect(() => {
    loadRegisteredDevices();
    loadFarms();
  }, []);

  const loadRegisteredDevices = async () => {
    try {
      const devices = await adminService.getDevices();
      setRegisteredDevices(devices);
    } catch (error) {
      console.error("Failed to load registered devices", error);
    }
  };

  const loadFarms = async () => {
    try {
      const farmList = await adminService.getFarms();
      setFarms(farmList);
    } catch (error) {
      console.error("Failed to load farms", error);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setScannedDevices([]);

    try {
      const devices = await adminService.scanEspDevices();
      setScannedDevices(devices);
      setLastScanTime(new Date());
      // Reload registered devices to get latest state
      await loadRegisteredDevices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to scan for ESP devices";
      setError(errorMessage);
      console.error("Scan error:", err);
      // Even if scan fails, show registered devices
      await loadRegisteredDevices();
    } finally {
      setIsScanning(false);
    }
  };

  const handleRegisterDevice = async (deviceId: string, ip: string) => {
    if (farms.length === 0) {
      alert("Please create a farm first before registering devices.");
      return;
    }

    const farmId = farms[0].id; // Default to first farm, or you could show a dialog
    setRegisteringDeviceId(deviceId);
    try {
      await adminService.assignDevice({ deviceId, farmId, ip });
      await loadRegisteredDevices();
      // Update scanned devices to reflect registration
      setScannedDevices(prev => prev.map(d => 
        d.deviceId === deviceId 
          ? { ...d, isRegistered: true, currentFarmId: farmId }
          : d
      ));
    } catch (error) {
      console.error("Failed to register device", error);
      alert("Failed to register device. Please try again.");
    } finally {
      setRegisteringDeviceId(null);
    }
  };

  // Combine scanned and registered devices
  const allDevices = showRegisteredOnly 
    ? registeredDevices.map(d => ({
        deviceId: d.deviceId,
        ip: d.ip || "Unknown",
        macAddress: undefined,
        lastSeen: undefined,
        isRegistered: true,
        currentFarmId: d.farmId
      }))
    : [
        ...scannedDevices,
        ...registeredDevices
          .filter(reg => !scannedDevices.some(s => s.deviceId === reg.deviceId))
          .map(d => ({
            deviceId: d.deviceId,
            ip: d.ip || "Unknown",
            macAddress: undefined,
            lastSeen: undefined,
            isRegistered: true,
            currentFarmId: d.farmId
          }))
      ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">ESP Device Scanner</h2>
          <p className="text-sm text-slate-600 mt-1">
            Scan the network for ESP32 devices and view their IDs and IP addresses
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Note: ESPs need to send data to the backend at least once to be discovered. 
            {registeredDevices.length > 0 && ` Found ${registeredDevices.length} registered device(s) in database.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showRegisteredOnly}
              onChange={(e) => setShowRegisteredOnly(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Show registered only
          </label>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Scanning...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Scan Network
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <p className="font-medium">Scan Error:</p>
          <p className="mt-1">{error}</p>
          {error.includes("404") && (
            <p className="mt-2 text-xs">
              The scan endpoint may not be implemented yet. Check your backend logs.
            </p>
          )}
        </div>
      )}

      {registeredDevices.length > 0 && allDevices.length === 0 && !isScanning && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <p className="font-medium">💡 Tip:</p>
          <p className="mt-1">
            You have {registeredDevices.length} registered device(s) in the database. 
            Check "Show registered only" to view them, or go to the{" "}
            <a href="/admin/devices" className="underline font-medium hover:text-blue-800">
              Devices page
            </a>{" "}
            to manage them.
          </p>
        </div>
      )}

      {lastScanTime && (
        <p className="text-xs text-slate-500 mb-4">
          Last scan: {lastScanTime.toLocaleTimeString()}
        </p>
      )}

      {allDevices.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  MAC Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Farm ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {allDevices.map((device) => (
                <tr key={device.deviceId} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 font-mono">
                    {device.deviceId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-500">
                    {device.ip}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-500">
                    {device.macAddress || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {device.isRegistered ? (
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 bg-green-100 text-green-800">
                        Registered
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800">
                        Unregistered
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {device.currentFarmId ? (
                      <span className="font-medium">{device.currentFarmId}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {!device.isRegistered && device.ip !== "Unknown" && (
                      <button
                        onClick={() => handleRegisterDevice(device.deviceId, device.ip)}
                        disabled={registeringDeviceId === device.deviceId || farms.length === 0}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {registeringDeviceId === device.deviceId ? "Registering..." : "Register"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isScanning && allDevices.length === 0 && !error && lastScanTime && (
        <div className="mt-4 text-center py-8 text-slate-500">
          <p className="text-sm font-medium">No ESP devices found.</p>
          <div className="mt-3 text-xs text-slate-600 space-y-1">
            <p>• Make sure your ESP32 devices are powered on and connected to the network</p>
            <p>• ESPs need to send sensor data to the backend at least once to be discovered</p>
            <p>• Check that your ESP is configured to send data to: {typeof window !== 'undefined' ? window.location.origin.replace('3000', '8080') : 'your backend URL'}</p>
            {registeredDevices.length === 0 && (
              <p className="mt-2 text-slate-500">• You can manually register devices on the Devices page</p>
            )}
          </div>
        </div>
      )}

      {!isScanning && allDevices.length === 0 && !error && !lastScanTime && (
        <div className="mt-4 text-center py-8 text-slate-400">
          <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm">Click "Scan Network" to discover ESP32 devices</p>
          {registeredDevices.length > 0 && (
            <p className="text-xs mt-2 text-slate-500">
              Or check "Show registered only" to see {registeredDevices.length} device(s) already in the database
            </p>
          )}
        </div>
      )}
    </div>
  );
}

