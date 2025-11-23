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
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-[#b2dfdb] to-[#80cbc4] px-6 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <PageHeader
          title="Greenhouse dashboard"
          subtitle="Live telemetry from connected sensors"
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
                  <p>No sensor data available</p>
                  <p className="mt-2 text-sm text-emerald-700">
                    Click "Request Data" to fetch the latest readings
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

