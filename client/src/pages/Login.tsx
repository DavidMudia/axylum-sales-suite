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

      <div className="space-y-6">

        {error && (
          <div
            className="
              rounded-xl
              bg-red-100
              px-4
              py-3
              text-sm
              text-red-700
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