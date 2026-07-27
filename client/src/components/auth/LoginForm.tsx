import { useState } from "react";

type Props = {
  onSubmit: (
    email: string,
    password: string
  ) => void;

  loading: boolean;
};

export default function LoginForm({
  onSubmit,
  loading,
}: Props) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {

        e.preventDefault();

        onSubmit(email, password);

      }}
    >

      <div>

        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue.
        </p>

      </div>


      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border px-4 py-3"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />


      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-xl border px-4 py-3"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />


      {/* THIS GOES HERE */}
      <button
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-blue-600
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>


    </form>
  );
}