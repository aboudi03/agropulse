"use client";

import { ProtectedRoute } from "../../presentation/auth/protected-route";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../presentation/auth/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "Farms", href: "/admin/farms" },
    { label: "Users", href: "/admin/users" },
    { label: "Devices", href: "/admin/devices" },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white shadow-xl">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-emerald-400">AgroPulse</h1>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>

          <nav className="mt-6 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="absolute bottom-0 w-64 border-t border-slate-800 p-4">
            <div className="mb-4 px-2">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
