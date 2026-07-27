import {
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock3,
  RefreshCw,
  Shield,
  Globe,
  Package,
  Activity,
} from "lucide-react";

export default function SystemSettings() {
  return (
    <div className="space-y-8">

      {/* Overall Health */}

      <div className="rounded-xl border bg-white p-6 shadow">

        <div className="mb-6 flex items-center gap-3">

          <Activity
            className="text-green-600"
            size={28}
          />

          <div>

            <h2 className="text-2xl font-bold">
              System Health
            </h2>

            <p className="text-gray-500">
              Overall application status
            </p>

          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-4">

          <HealthCard
            title="Server"
            status="Online"
            color="green"
          />

          <HealthCard
            title="Database"
            status="Connected"
            color="green"
          />

          <HealthCard
            title="API"
            status="Healthy"
            color="green"
          />

          <HealthCard
            title="Storage"
            status="Normal"
            color="green"
          />

        </div>

      </div>

      {/* Resources */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card
          icon={<Cpu />}
          title="CPU Usage"
          value="12%"
        />

        <Card
          icon={<MemoryStick />}
          title="Memory Usage"
          value="480 MB"
        />

        <Card
          icon={<HardDrive />}
          title="Storage"
          value="8.4 GB"
        />

        <Card
          icon={<Clock3 />}
          title="Server Uptime"
          value="14 Days"
        />

      </div>

      {/* Application */}

      <div className="rounded-xl border bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-semibold">
          Application
        </h2>

        <Info
          icon={<Package size={18} />}
          label="Version"
          value="1.0.0"
        />

        <Info
          icon={<Globe size={18} />}
          label="Environment"
          value="Production"
        />

        <Info
          icon={<Server size={18} />}
          label="Node Version"
          value="22.x"
        />

        <Info
          icon={<Database size={18} />}
          label="Database"
          value="PostgreSQL"
        />

      </div>

      {/* Security */}

      <div className="rounded-xl border bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-semibold">
          Security
        </h2>

        <Info
          icon={<Shield size={18} />}
          label="SSL"
          value="Enabled"
        />

        <Info
          icon={<Shield size={18} />}
          label="JWT Authentication"
          value="Enabled"
        />

        <Info
          icon={<Shield size={18} />}
          label="Encryption"
          value="AES-256"
        />

      </div>

      {/* Maintenance */}

      <div className="rounded-xl border bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-semibold">
          Maintenance
        </h2>

        <div className="flex flex-wrap gap-4">

          <button className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
            <RefreshCw className="mr-2 inline" size={18}/>
            Refresh Status
          </button>

          <button className="rounded-lg border px-5 py-3 hover:bg-gray-100">
            Download Logs
          </button>

          <button className="rounded-lg border px-5 py-3 hover:bg-gray-100">
            Run Diagnostics
          </button>

        </div>

      </div>

    </div>
  );
}

function HealthCard({
  title,
  status,
  color,
}: any) {
  return (
    <div className="rounded-xl border p-5">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <div className="mt-3 flex items-center gap-3">

        <div
          className={`h-3 w-3 rounded-full ${
            color === "green"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />

        <span className="font-semibold">
          {status}
        </span>

      </div>

    </div>
  );
}

function Card({
  icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <div className="mb-4 text-blue-600">
        {icon}
      </div>

      <p className="text-gray-500">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold">
        {value}
      </h3>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: any) {
  return (
    <div className="flex items-center justify-between border-b py-4">

      <div className="flex items-center gap-3">

        {icon}

        <span>{label}</span>

      </div>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}