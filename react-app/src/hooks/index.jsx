import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
import { addReposToCache, deleteRepoFromCache, updateProfileToCache } from "../services/cacheUpdaters";

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

export const useDeleteRepo = () => {
  const { mutate } = useMutation({
    mutationFn: (repoToDelete) => deleteRepo(repoToDelete),
    onSuccess: (deletedRepo) => deleteRepoFromCache(deletedRepo),
    onError: (error) => {
      console.error(error);
      console.error("Error deleting repos");
    },
  });
  return mutate;
};

const deleteRepo = async (repoToDelete) => {
  const res = await fetch("/api/repos", {
    method: "DELETE",
    body: JSON.stringify(repoToDelete),
  });
  if (!res.ok) {
    throw new Error("error deleting repos");
  }
  const deletedRepo = await res.json();
  return deletedRepo;
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
  const { error, ...userData } = newData;
  if (res.status === 207 && error) {
    console.error(error?.user);
    console.error(error?.repos);
  }
  return userData;
};