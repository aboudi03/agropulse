"use client";

import { EspScanner } from "./components/esp-scanner";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="mt-2 text-slate-600">Welcome to the AgroPulse Admin Console.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats Cards */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Total Farms</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">--</p>
        </div>
        
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Active Users</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">--</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Connected Devices</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">--</p>
        </div>
      </div>

      {/* ESP Scanner */}
      <div className="mt-8">
        <EspScanner />
      </div>
    </div>
  );
}
