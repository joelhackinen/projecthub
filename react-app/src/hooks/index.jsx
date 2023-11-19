import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
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
    onSuccess: (repos) => addReposToCache(repos),
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

const addRepos = async (reposToAdd) => {
  const res = await fetch("/api/repos", {
    method: "POST",
    body: JSON.stringify(reposToAdd),
  });
  if (!res.ok) {
    throw new Error("error adding repos");
  }
  return await res.json();
};

const updateProfile = async (updatedProfile) => {
  const res = await fetch("/api/users/", {
    method: "PUT",
    body: JSON.stringify(updatedProfile),
  });
  const newData = await res.json();
  if (!res.ok) {
    throw new Error(newData?.error ?? "updating the profile failed");
  }
  return newData;
};