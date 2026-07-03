import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <p>{user?.email}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}