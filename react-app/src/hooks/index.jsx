import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
import { addRepos, updateProfile } from "../services/profiles";
import { addReposToCache, updateProfileToCache } from "../services/cacheUpdaters";

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
    mutationFn: (repos) => addRepos(repos),
    onSuccess: (repoData) => addReposToCache(repoData),
    onError: (error) => {
      console.error(error);
      alert("error adding repos:", error.message ?? "unknown error");
    },
  });
  return mutate;
};

export const useUpdateProfile = () => {
  const { mutate } = useMutation({
    mutationFn: (updatedProfile) => updateProfile(updatedProfile),
    onSuccess: (updatedProfile) => updateProfileToCache(updatedProfile),
    onError: (error) => {
      console.error(error);
      alert("error updating profile:", error.message ?? "unknown error");
    },
  });
  return mutate;
};