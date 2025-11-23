"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SensorService } from "../../../application/services/sensor-service";
import { HttpSensorRepository } from "../../../infrastructure/repositories/http-sensor-repository";
import { DashboardViewModel, type DashboardState } from "../view-models/dashboard-view-model";

const AUTO_REFRESH_MS = 15_000;

export const useDashboardViewModel = () => {
  const viewModel = useMemo(() => {
    const shouldUseMock =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      !process.env.NEXT_PUBLIC_API_BASE_URL;

    // 👇 If mock repo removed, always use HTTP repo.
    const repository = new HttpSensorRepository();

    const service = new SensorService(repository);
    return new DashboardViewModel(service);
  }, []);

  const [state, setState] = useState<DashboardState>({
    latestReading: null,
    history: [],
    isLoading: true,
    isRequesting: false,
    error: undefined,
  });

  const load = useCallback(async () => {
    try {
      const nextState = await viewModel.loadInitialState();
      setState(nextState);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load data",
      }));
    }
  }, [viewModel]);

  const refreshLatest = useCallback(async () => {
    try {
      const latest = await viewModel.refreshReading();
      setState((prev) => ({ ...prev, latestReading: latest }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to refresh data",
      }));
    }
  }, [viewModel]);

  const refreshHistory = useCallback(async () => {
    try {
      const history = await viewModel.reloadHistory();
      setState((prev) => ({ ...prev, history }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to refresh history",
      }));
    }
  }, [viewModel]);

  const handleRequestFreshReading = useCallback(
    async (controllerFromCaller?: string) => {
      setState((prev) => ({ ...prev, isRequesting: true }));
      try {
        const controller =
          controllerFromCaller ?? process.env.NEXT_PUBLIC_CONTROLLER_ID;

        await viewModel.requestFreshReading(controller);

        await Promise.all([refreshLatest(), refreshHistory()]);
      } finally {
        setState((prev) => ({ ...prev, isRequesting: false }));
      }
    },
    [refreshHistory, refreshLatest, viewModel]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshLatest();
    }, AUTO_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [refreshLatest]);

  return {
    state,
    refreshLatest,
    refreshHistory,
    requestFreshReading: handleRequestFreshReading,
  };
};
