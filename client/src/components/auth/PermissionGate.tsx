import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

type Props = {
  permission: string;
  children: ReactNode;
};

export default function PermissionGate({
  permission,
  children,
}: Props) {
  const { hasPermission } = useAuth();  // ✅ use the context function

  if (!hasPermission(permission)) return null;

  return <>{children}</>;
}