import { useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: queryMeFn,
    staleTime: Infinity,
  });
  return data;
};