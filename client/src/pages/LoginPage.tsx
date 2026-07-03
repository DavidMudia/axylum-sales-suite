import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginRequest } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginRequest({
        email,
        password,
      });

      login(response.data.token, response.data.user);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <p style={{ color: "red" }}>
        {error}
      </p>

    </div>
  );
}