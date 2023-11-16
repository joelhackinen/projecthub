import { useQuery } from "@tanstack/react-query";
import { queryUserFn } from "../services/auth";

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: queryUserFn,
    staleTime: Infinity,
  });

  return data;
};