import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const {
    loading,
    error,
    handleLogin,
  } = useLogin();

  return (
    <AuthLayout>
      <div className="w-full space-y-5 sm:space-y-6">

        {error && (
          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              leading-5
              text-red-700
              dark:border-red-900
              dark:bg-red-950
              dark:text-red-300
            "
          >
            {error}
          </div>
        )}

        <LoginForm
          loading={loading}
          onSubmit={handleLogin}
        />

      </div>
    </AuthLayout>
  );
}