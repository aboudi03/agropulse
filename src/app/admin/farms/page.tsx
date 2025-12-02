"use client";

import React, { useState, useEffect } from "react";
import { AdminService } from "../../../application/services/admin-service";
import { HttpAdminRepository } from "../../../infrastructure/repositories/http-admin-repository";
import type { FarmDto, AdminDeviceDto } from "../../../application/dtos/admin-dtos";

export default function FarmsPage() {
  const [farms, setFarms] = useState<FarmDto[]>([]);
  const [allDevices, setAllDevices] = useState<AdminDeviceDto[]>([]);
  const [expandedFarmId, setExpandedFarmId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newFarmName, setNewFarmName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingFarmId, setDeletingFarmId] = useState<number | null>(null);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<string | null>(null);

  const adminService = new AdminService(new HttpAdminRepository());

  const loadFarms = async () => {
    try {
      const data = await adminService.getFarms();
      setFarms(data);
    } catch (error) {
      console.error("Failed to load farms", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const data = await adminService.getDevices();
      setAllDevices(data);
    } catch (error) {
      console.error("Failed to load devices", error);
    }
  };

  useEffect(() => {
    loadFarms();
    loadDevices();
  }, []);

  const getDevicesForFarm = (farmId: number): AdminDeviceDto[] => {
    return allDevices.filter(device => device.farmId === farmId);
  };

  const handleUpdateDeviceFarm = async (deviceId: string, newFarmId: number) => {
    setUpdatingDeviceId(deviceId);
    try {
      await adminService.updateDeviceFarm(deviceId, newFarmId);
      await loadDevices(); // Reload devices list
    } catch (error) {
      console.error("Failed to update device farm", error);
      alert("Failed to update device farm assignment. Please try again.");
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await adminService.createFarm({ name: newFarmName });
      setNewFarmName("");
      await loadFarms(); // Reload list
    } catch (error) {
      console.error("Failed to create farm", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFarm = async (farmId: number) => {
    const farm = farms.find(f => f.id === farmId);
    if (!confirm(`Are you sure you want to delete farm "${farm?.name || farmId}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingFarmId(farmId);
    try {
      await adminService.deleteFarm(farmId);
      loadFarms(); // Reload list
    } catch (error) {
      console.error("Failed to delete farm", error);
      alert("Failed to delete farm. Please try again.");
    } finally {
      setDeletingFarmId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Farm Management</h1>
      
      {/* Create Farm Form */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Create New Farm</h2>
        <form onSubmit={handleCreateFarm} className="mt-4 flex gap-4">
          <input
            type="text"
            value={newFarmName}
            onChange={(e) => setNewFarmName(e.target.value)}
            placeholder="Farm Name"
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            {isCreating ? "Creating..." : "Create Farm"}
          </button>
        </form>
      </div>

      {/* Farms List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">Existing Farms</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">ESP Devices</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Loading...</td>
                </tr>
              ) : farms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">No farms found</td>
                </tr>
              ) : (
                farms.map((farm) => {
                  const farmDevices = getDevicesForFarm(farm.id);
                  const isExpanded = expandedFarmId === farm.id;
                  
                  return (
                    <React.Fragment key={farm.id}>
                      <tr className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{farm.id}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{farm.name}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            {farmDevices.length} ESP{farmDevices.length !== 1 ? 's' : ''}
                            <button
                              onClick={() => setExpandedFarmId(isExpanded ? null : farm.id)}
                              className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                            >
                              {isExpanded ? 'Hide' : 'Show'} Devices
                            </button>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{farm.createdAt || "-"}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteFarm(farm.id)}
                            disabled={deletingFarmId === farm.id}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingFarmId === farm.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-slate-50">
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-slate-700">Assigned ESP Devices</h4>
                              {farmDevices.length === 0 ? (
                                <p className="text-sm text-slate-500">No devices assigned to this farm.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-white">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Device ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">IP Address</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Reassign to Farm</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                      {farmDevices.map((device) => (
                                        <tr key={device.deviceId}>
                                          <td className="px-4 py-2 text-sm font-medium text-slate-900">{device.deviceId}</td>
                                          <td className="px-4 py-2 text-sm font-mono text-slate-500">{device.ip || "-"}</td>
                                          <td className="px-4 py-2 text-sm">
                                            <select
                                              value={device.farmId}
                                              onChange={(e) => handleUpdateDeviceFarm(device.deviceId, parseInt(e.target.value))}
                                              disabled={updatingDeviceId === device.deviceId}
                                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              {farms.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                  {f.name} ({f.id})
                                                </option>
                                              ))}
                                            </select>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              <div className="pt-2 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                  To assign a new device to this farm, go to the Devices page and change its farm assignment.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
