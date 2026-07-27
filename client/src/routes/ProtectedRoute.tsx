import {
  Navigate,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";


type Props = {

  children: ReactNode;

  permission?: string;

  permissions?: string[];

  role?: string;

};



export default function ProtectedRoute({
  children,
  permission,
  permissions,
  role,
}: Props) {


  const {
    user,
    isAuthenticated,
    hasPermission,
  } = useAuth();




  // Not logged in

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }





  // User missing

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }





  // Role check

  if (
    role &&
    user.role !== role
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );

  }





  // Single permission check

  if (
    permission &&
    !hasPermission(permission)
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );

  }





  // Multiple permissions check

  if (
    permissions &&
    permissions.length > 0
  ) {


    const allowed =
      permissions.some(
        permission =>
          hasPermission(permission)
      );



    if (!allowed) {

      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );

    }

  }




  return (
    <>
      {children}
    </>
  );

}