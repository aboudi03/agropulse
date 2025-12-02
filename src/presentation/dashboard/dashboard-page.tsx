"use client";

import { useMemo } from "react";
import { useDashboardViewModel } from "./hooks/useDashboardViewModel";
import { useAuth } from "../auth/auth-context";
import { PageHeader } from "../components/page-header";
import { SENSOR_METRICS } from "../../shared/constants/sensor-metrics";
import { MetricCard } from "./components/metric-card";
import { TrendChart } from "./components/trend-chart";
import { HistoryTable } from "./components/history-table";
import { AlertsPanel } from "./components/alerts-panel";
import { RequestReadingButton } from "./components/request-reading-button";
import { DeviceSelector } from "./components/device-selector";

export const DashboardPage = () => {
  const { logout } = useAuth();
  const { state, devices, selectedDeviceId, onDeviceChange, requestFreshReading } = useDashboardViewModel();
  const { latestReading, history, isLoading, isRequesting, error } = state;

  const metrics = useMemo(() => {
    if (!latestReading) {
      return [];
    }

    return SENSOR_METRICS
      .filter(metric => metric != null)  // Filter out any null/undefined metrics
      .map((metric) => {
        // Additional safety check
        if (!metric || !metric.id) {
          return null;
        }
        
        const raw = latestReading[metric.id];
        const value = raw == null ? null : raw;
        const status = typeof value === "number" ? metric.getStatus(value) : "warning";
        return {
          metric,
          value,
          status,
        };
      })
      .filter(item => item !== null);  // Remove any null items
  }, [latestReading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-[#b2dfdb] to-[#80cbc4] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <PageHeader
          title="Greenhouse dashboard"
          subtitle={`Live telemetry from ${latestReading?.deviceId || 'connected sensors'}`}
          actions={
            <div className="flex items-center gap-3">
              <DeviceSelector
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onDeviceChange={onDeviceChange}
                isDisabled={isLoading}
              />
              <button
                onClick={logout}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                Sign Out
              </button>
            </div>
          }
        />
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 backdrop-blur-sm">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-white/20 bg-white/30 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-600" />
              Connecting to greenhouse sensors...
            </div>
          </div>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.length > 0 ? (
                <>
                  {metrics.map(({ metric, value, status }) => (
                    <MetricCard 
                      key={metric?.id || 'unknown'}
                      metric={metric} 
                      value={value} 
                      status={status} 
                    />
                  ))}
                  <div className="flex items-center justify-center">
                    <RequestReadingButton
                      isLoading={isRequesting}
                      onClick={requestFreshReading}
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-full rounded-3xl border border-white/20 bg-white/30 p-8 text-center text-emerald-800 backdrop-blur-md">
                  <p className="font-medium">No sensor data available yet</p>
                  <p className="mt-2 text-sm text-emerald-700">
                    {selectedDeviceId ? (
                      <>Device <span className="font-mono font-semibold">{selectedDeviceId}</span> is assigned but hasn't sent any readings yet.</>
                    ) : (
                      "Waiting for sensor data..."
                    )}
                  </p>
                  <p className="mt-1 text-sm text-emerald-600">
                    Make sure your ESP32 device is connected and sending data, or click "Request Data" to trigger a reading.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <RequestReadingButton
                      isLoading={isRequesting}
                      onClick={requestFreshReading}
                    />
                  </div>
                </div>
              )}
            </section>
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TrendChart readings={history} />
              </div>
              <AlertsPanel readings={history} />
            </section>
            <HistoryTable readings={history} />
          </>
        )}
      </div>
    </div>
  );
};

