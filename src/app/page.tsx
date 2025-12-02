import { DashboardPage } from "@/src/presentation/dashboard/dashboard-page";
import { ProtectedRoute } from "@/src/presentation/auth/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}

