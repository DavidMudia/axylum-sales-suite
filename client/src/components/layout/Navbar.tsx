import {
  Menu,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

type Props = {
  onMenuClick: () => void;
};

export default function Navbar({
  onMenuClick,
}: Props) {
  const navigate = useNavigate();

  const { logout, user } =
    useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu />
        </button>

        <h2 className="text-lg md:text-xl font-semibold">
          Dashboard
        </h2>

      </div>

      <div className="flex items-center gap-3">

        <span className="hidden md:block">
          {user?.name ?? "User"}
        </span>

        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="h-10 w-10 rounded-full"
        />

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </header>
  );
}