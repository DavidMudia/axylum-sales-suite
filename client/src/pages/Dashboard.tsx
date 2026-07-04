import DashboardLayout from "../layouts/DashboardLayout";

import KPI from "../components/dashboard/KPI";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentCustomer from "../components/dashboard/RecentCustomer";

import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
} from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {

  const { data, isLoading } = useDashboard();

  if (isLoading)
    return <p>Loading...</p>;

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Customers"
            value={data?.totalCustomers ?? 0}
            icon={<Users />}
          />

          <KPI
            title="Active"
            value={data?.activeCustomers ?? 0}
            icon={<UserCheck />}
          />

          <KPI
            title="Inactive"
            value={data?.inactiveCustomers ?? 0}
            icon={<UserX />}
          />

          <KPI
            title="New This Month"
            value={data?.newThisMonth ?? 0}
            icon={<CalendarDays />}
          />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2">

            <RevenueChart />

          </div>

          <RecentCustomer />

        </div>

      </div>

    </DashboardLayout>
  );
}