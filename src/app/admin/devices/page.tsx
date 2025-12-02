"use client";

import { useState, useEffect } from "react";
import { AdminService } from "../../../application/services/admin-service";
import { HttpAdminRepository } from "../../../infrastructure/repositories/http-admin-repository";
import type { AdminDeviceDto, FarmDto } from "../../../application/dtos/admin-dtos";

export default function DevicesPage() {
  const [devices, setDevices] = useState<AdminDeviceDto[]>([]);
  const [farms, setFarms] = useState<FarmDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<string | null>(null);

  const adminService = new AdminService(new HttpAdminRepository());

  const loadDevices = async () => {
    try {
      const data = await adminService.getDevices();
      setDevices(data);
    } catch (error) {
      console.error("Failed to load devices", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFarms = async () => {
    try {
      const data = await adminService.getFarms();
      setFarms(data);
    } catch (error) {
      console.error("Failed to load farms", error);
    }
  };

  useEffect(() => {
    loadDevices();
    loadFarms();
  }, []);

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm(`Are you sure you want to delete device "${deviceId}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingDeviceId(deviceId);
    try {
      await adminService.deleteDevice(deviceId);
      loadDevices(); // Reload list
    } catch (error) {
      console.error("Failed to delete device", error);
      alert("Failed to delete device. Please try again.");
    } finally {
      setDeletingDeviceId(null);
    }
  };

  const handleUpdateDeviceFarm = async (deviceId: string, newFarmId: number) => {
    setUpdatingDeviceId(deviceId);
    try {
      await adminService.updateDeviceFarm(deviceId, newFarmId);
      loadDevices(); // Reload list
    } catch (error) {
      console.error("Failed to update device farm", error);
      alert("Failed to update device farm assignment. Please try again.");
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Device Management</h1>
      
      {/* Info Card */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Devices & farm assignment</h2>
        <p className="mt-2 text-sm text-slate-600">
          Devices appear here automatically after they send data to the backend. Use the{" "}
          <span className="font-semibold">Farm</span> dropdown in the table below to assign or change
          which farm an ESP belongs to.
        </p>
      </div>

      {/* Devices List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">Registered Devices</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Device ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Farm ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">IP Address (Auto-detected)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">Loading...</td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">No devices found</td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.deviceId}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{device.deviceId}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <select
                        value={device.farmId}
                        onChange={(e) => handleUpdateDeviceFarm(device.deviceId, parseInt(e.target.value))}
                        disabled={updatingDeviceId === device.deviceId}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {farms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.name} ({farm.id})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-500">{device.ip || "-"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteDevice(device.deviceId)}
                        disabled={deletingDeviceId === device.deviceId || updatingDeviceId === device.deviceId}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingDeviceId === device.deviceId ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
