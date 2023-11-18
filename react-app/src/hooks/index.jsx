import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
import { addReposToCache, postRepos } from "../services/profiles";

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: queryMeFn,
    staleTime: Infinity,
  });
  return data;
};

export const useAddRepos = () => {
  const { mutate } = useMutation({
    mutationFn: (repos) => postRepos(repos),
    onSuccess: (repoData) => {
      addReposToCache(repoData);
      alert(`${repoData.length} new repos added`);
    },
    onError: (error) => {
      alert("error adding repos:", error.message ?? "unknown error");
    },
  });
  return mutate;
};