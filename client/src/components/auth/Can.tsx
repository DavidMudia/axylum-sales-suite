import type { ReactNode } from "react";

import { useAuth } from "../../context/AuthContext";


type Props = {

  permission?: string;

  children: ReactNode;

};



export default function Can({
  permission,
  children,
}: Props) {


  const {
    hasPermission,
  } = useAuth();



  if (
    permission &&
    !hasPermission(permission)
  ) {

    return null;

  }



  return (
    <>
      {children}
    </>
  );

}