import { Navigate } from "react-router-dom";

import type { ReactNode } from "react";

import { useAuth } from "../../context/AuthContext";

type Props = {

    permission: string;

    children: ReactNode;

};

export default function RequirePermission({

    permission,

    children,

}: Props) {

    const { user } = useAuth();

    const allowed =
        user?.permissions.includes(permission);

    if (!allowed)

        return <Navigate to="/" replace />;

    return <>{children}</>;

}