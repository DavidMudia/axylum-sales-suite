import {
  ShieldCheck,
  Lock,
  Smartphone,
  Clock3,
  LogOut,
} from "lucide-react";

export default function SecuritySettings() {
  return (
    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-600" />

          <div>
            <h2 className="text-xl font-semibold">
              Security Overview
            </h2>

            <p className="text-gray-500">
              Current protection status.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">

          <Status
            title="Password"
            value="Strong"
            color="bg-green-500"
          />

          <Status
            title="2FA"
            value="Coming Soon"
            color="bg-yellow-500"
          />

          <Status
            title="Session Protection"
            value="Enabled"
            color="bg-green-500"
          />

        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">

        <div className="flex items-center gap-3 mb-5">

          <Clock3 className="text-blue-600"/>

          <h2 className="text-xl font-semibold">
            Session Timeout
          </h2>

        </div>

        <select className="w-full rounded-lg border p-3">

          <option>15 Minutes</option>

          <option>30 Minutes</option>

          <option>1 Hour</option>

          <option>2 Hours</option>

        </select>

      </div>

      <div className="rounded-xl border bg-white p-6 shadow">

        <div className="flex items-center gap-3 mb-5">

          <Smartphone className="text-green-600"/>

          <h2 className="text-xl font-semibold">
            Two-Factor Authentication
          </h2>

        </div>

        <button
          className="rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          Enable Two-Factor Authentication
        </button>

      </div>

      <div className="rounded-xl border bg-white p-6 shadow">

        <div className="flex items-center gap-3 mb-5">

          <Lock className="text-blue-600"/>

          <h2 className="text-xl font-semibold">
            Password
          </h2>

        </div>

        <button
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Change Password
        </button>

      </div>

      <div className="rounded-xl border bg-white p-6 shadow">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              Active Sessions
            </h2>

            <p className="text-gray-500">
              Sign out every logged-in device.
            </p>

          </div>

          <button
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >

            <LogOut size={18}/>

            Logout All Devices

          </button>

        </div>

      </div>

    </div>
  );
}

function Status({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">

      <span>{title}</span>

      <div className="flex items-center gap-2">

        <div
          className={`h-3 w-3 rounded-full ${color}`}
        />

        <span className="font-medium">
          {value}
        </span>

      </div>

    </div>
  );
}