"use client";

import { useMemo } from "react";
import { useDashboardViewModel } from "./hooks/useDashboardViewModel";
import { PageHeader } from "../components/page-header";
import { SENSOR_METRICS } from "../../shared/constants/sensor-metrics";
import { MetricCard } from "./components/metric-card";
import { TrendChart } from "./components/trend-chart";
import { HistoryTable } from "./components/history-table";
import { AlertsPanel } from "./components/alerts-panel";
import { RequestReadingButton } from "./components/request-reading-button";

export const DashboardPage = () => {
  const { state, requestFreshReading } = useDashboardViewModel();
  const { latestReading, history, isLoading, isRequesting, error } = state;

  const metrics = useMemo(() => {
    if (!latestReading) {
      return [];
    }

    return SENSOR_METRICS
      .filter(metric => metric != null)  // Filter out any null/undefined metrics
      .map((metric) => {
        const raw = latestReading[metric.id];
        const value = raw == null ? null : raw;
        const status = typeof value === "number" ? metric.getStatus(value) : "warning";
        return {
          metric,
          value,
          status,
        };
      });
  }, [latestReading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PageHeader
          title="Greenhouse dashboard"
          subtitle="Live telemetry from connected sensors"
          actions={
            <RequestReadingButton
  isLoading={isRequesting}
  onClick={requestFreshReading}
/>
          }
        />
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white/60">
            <div className="flex items-center gap-2 text-emerald-600">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              Connecting to greenhouse sensors...
            </div>
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.length > 0 ? (
                metrics.map(({ metric, value, status }) => (
                  <MetricCard 
                    key={metric?.id || 'unknown'}
                    metric={metric} 
                    value={value} 
                    status={status} 
                  />
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-emerald-200 bg-white/60 p-6 text-center text-emerald-600">
                  <p>No sensor data available</p>
                  <p className="mt-2 text-sm text-emerald-500">
                    Click "Request Data" to fetch the latest readings
                  </p>
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

