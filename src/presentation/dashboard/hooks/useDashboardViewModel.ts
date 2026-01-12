"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Device } from "../../../domain/models/device";
import { SensorService } from "../../../application/services/sensor-service";
import { HttpSensorRepository } from "../../../infrastructure/repositories/http-sensor-repository";
import { DashboardViewModel, type DashboardState } from "../view-models/dashboard-view-model";

const AUTO_REFRESH_MS = 15_000;

export const useDashboardViewModel = () => {
  const pathname = usePathname();
  const viewModel = useMemo(() => {
    const shouldUseMock =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      !process.env.NEXT_PUBLIC_API_BASE_URL;

    // 👇 If mock repo removed, always use HTTP repo.
    const repository = new HttpSensorRepository();

    const service = new SensorService(repository);
    
    // Get deviceId from environment variable or use default
    const deviceId = process.env.NEXT_PUBLIC_DEVICE_ID || "GREENHOUSE_001";
    
    return new DashboardViewModel(service, deviceId);
  }, []);

  const [state, setState] = useState<DashboardState>({
    latestReading: null,
    history: [],
    isLoading: true,
    isRequesting: false,
    error: undefined,
  });

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    viewModel.getDeviceId()
  );

  const load = useCallback(async () => {
    try {
      const nextState = await viewModel.loadInitialState();
      setState(nextState);
    } catch (error) {
      // Don't show error for 404 - device may exist but have no readings yet
      const is404 = error instanceof Error && error.message.includes('404');
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: is404 ? undefined : (error instanceof Error ? error.message : "Failed to load data"),
      }));
    }
  }, [viewModel]);

  const loadDevices = useCallback(async () => {
    // Only load devices if we're on the dashboard page (root or home)
    // Skip loading on admin, login, register pages
    if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      return;
    }
    
    try {
      const deviceList = await viewModel.loadDevices();
      setDevices(deviceList);
      
      // If we have devices and the current device doesn't exist in the list,
      // switch to the first device from the backend
      if (deviceList.length > 0) {
        const currentDeviceId = viewModel.getDeviceId();
        const deviceExists = deviceList.some(d => d.deviceId === currentDeviceId);
        
        if (!deviceExists) {
          // Current device doesn't exist in user's devices, switch to first one
          const firstDevice = deviceList[0];
          console.log(`Switching from ${currentDeviceId} to ${firstDevice.deviceId}`);
          setSelectedDeviceId(firstDevice.deviceId);
          viewModel.setDeviceId(firstDevice.deviceId);
          // Reload data for the new device
          setState((prev) => ({ ...prev, isLoading: true }));
          await load();
        }
      }
    } catch (error) {
      // Gracefully handle missing /api/devices endpoint
      if (error instanceof Error && error.message.includes('404')) {
        console.warn('⚠️ /api/device endpoint not found. Device selector will be hidden.');
        console.warn('To enable device switching, implement GET /api/device on your backend.');
        setDevices([]);
      } else {
        console.error("Failed to load devices:", error);
        setDevices([]);
      }
    }
  }, [viewModel, pathname, load]);

  const refreshLatest = useCallback(async () => {
    try {
      const latest = await viewModel.refreshReading();
      setState((prev) => ({ ...prev, latestReading: latest }));
    } catch (error) {
      // Don't show error for 404 - device may exist but have no readings yet
      const is404 = error instanceof Error && error.message.includes('404');
      if (!is404) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to refresh data",
        }));
      }
    }
  }, [viewModel]);

  const refreshHistory = useCallback(async () => {
    try {
      const history = await viewModel.reloadHistory();
      setState((prev) => ({ ...prev, history }));
    } catch (error) {
      // Don't show error for 404 - device may exist but have no readings yet
      const is404 = error instanceof Error && error.message.includes('404');
      if (!is404) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to refresh history",
        }));
      }
    }
  }, [viewModel]);

  const handleRequestFreshReading = useCallback(
    async () => {
      setState((prev) => ({ ...prev, isRequesting: true, error: undefined }));
      try {
        await viewModel.requestFreshReading();

        // Wait for ESP32 to poll (up to 5s) and upload data
        await new Promise(resolve => setTimeout(resolve, 6000));

        await Promise.all([refreshLatest(), refreshHistory()]);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to request fresh reading",
        }));
      } finally {
        setState((prev) => ({ ...prev, isRequesting: false }));
      }
    },
    [refreshHistory, refreshLatest, viewModel]
  );

  const handleDeviceChange = useCallback(
    async (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      viewModel.setDeviceId(deviceId);
      setState((prev) => ({ ...prev, isLoading: true }));
      await load();
    },
    [load, viewModel]
  );

  useEffect(() => {
    load();
    loadDevices();
  }, [load, loadDevices]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshLatest();
    }, AUTO_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [refreshLatest]);

  return {
    state,
    devices,
    selectedDeviceId,
    refreshLatest,
    refreshHistory,
    requestFreshReading: handleRequestFreshReading,
    onDeviceChange: handleDeviceChange,
  };
};
