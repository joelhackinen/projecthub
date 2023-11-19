import { qclient } from "../queryClient";

export const fetchProfile = async (url_name) => {
  return await qclient.fetchQuery({
    queryKey: ["profile", url_name],
    queryFn: async () => {
      const res = await fetch(`/api/users/${url_name}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "profile fetching failed");
      }
      return data;
    },
    staleTime: Infinity,
  });
};