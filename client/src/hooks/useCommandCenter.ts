import { useQuery } from "@tanstack/react-query";

import { getCommandCenter } from "../api/commandCenter";


export function useCommandCenter() {
  return useQuery({
    queryKey: ["command-center"],
    queryFn: getCommandCenter,
  });
}
