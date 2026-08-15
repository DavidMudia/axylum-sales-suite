import { useState } from "react";

type Props = {
  onSubmit: (
    email: string,
    password: string
  ) => void;

  loading: boolean;
};

const DEMO_EMAIL = "admin@mudia.com";
const DEMO_PASSWORD = "admin123";

export default function LoginForm({
  onSubmit,
  loading,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function useDemoAccount() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <form
      className="w-full space-y-5 sm:space-y-6"
      onSubmit={(e) => {
        e.preventDefault();

        if (!email || !password || loading) {
          return;
        }

        onSubmit(email, password);
      }}
    >
      {/* Heading */}
      <div>
        <h1
          className="
            text-2xl
            font-bold
            tracking-tight
            text-gray-900
            sm:text-3xl
            dark:text-white
          "
        >
          Welcome Back
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-5
            text-gray-500
            dark:text-gray-400
          "
        >
          Sign in to continue to Axylum Sales Suite.
        </p>
      </div>

      {/* Demo credentials */}
      <div
        className="
          rounded-2xl
          border
          border-blue-200
          bg-blue-50
          p-4
          dark:border-blue-900
          dark:bg-blue-950/40
        "
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p
              className="
                text-sm
                font-semibold
                text-blue-900
                dark:text-blue-200
              "
            >
              Demo Account
            </p>

            <p
              className="
                mt-1
                break-all
                text-xs
                text-blue-700
                dark:text-blue-300
              "
            >
              superadmin@axylum.com
            </p>

            <p
              className="
                text-xs
                text-blue-700
                dark:text-blue-300
              "
            >
              Password: Admin@123
            </p>
          </div>

          <button
            type="button"
            onClick={useDemoAccount}
            className="
              w-full
              shrink-0
              rounded-lg
              border
              border-blue-300
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-blue-700
              transition
              hover:bg-blue-100
              active:scale-[0.98]
              sm:w-auto
              dark:border-blue-800
              dark:bg-blue-900/50
              dark:text-blue-200
              dark:hover:bg-blue-900
            "
          >
            Use Demo Account
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="
            block
            text-sm
            font-medium
            text-gray-700
            dark:text-gray-300
          "
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            text-sm
            text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white
            dark:placeholder:text-gray-500
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="
            block
            text-sm
            font-medium
            text-gray-700
            dark:text-gray-300
          "
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            text-sm
            text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white
            dark:placeholder:text-gray-500
          "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-blue-600
          px-4
          py-3
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-blue-700
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      {/* Demo notice */}
      <p
        className="
          text-center
          text-xs
          leading-5
          text-gray-400
          dark:text-gray-500
        "
      >
        Demo credentials are provided for portfolio
        and demonstration purposes.
      </p>
    </form>
  );
}