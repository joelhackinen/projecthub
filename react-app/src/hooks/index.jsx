import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
import { addReposToCache, deleteRepoFromCache, updateProfileToCache, updateRepoToCache } from "../services/cacheUpdaters";

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
    mutationFn: (profileToUpdate) => updateProfile(profileToUpdate),
    onSuccess: (updatedProfile) => updateProfileToCache(updatedProfile),
    onError: (error) => {
      console.error(error);
      alert("error updating profile:", error.message ?? "unknown error");
    },
  });
  return mutate;
};

export const useUpdateRepo = () => {
  const { mutate } = useMutation({
    mutationFn: (repoToUpdate) => updateRepo(repoToUpdate),
    onSuccess: (updatedRepo) => updateRepoToCache(updatedRepo),
    onError: () => {
      console.log(error);
      alert("error updating repo:", error.message ?? "unknown error");
    }
  });
  return mutate;
};

const updateRepo = async (repoToUpdate) => {
  const res = await fetch(`/api/repos/${repoToUpdate.id}`, {
    method: "PUT",
    body: JSON.stringify(repoToUpdate),
  });
  if (!res.ok) {
    throw new Error("error updating repo");
  }
  const updatedRepo = await res.json();
  return updatedRepo;
};

export const useDeleteRepo = () => {
  const { mutate } = useMutation({
    mutationFn: (repoId) => deleteRepo(repoId),
    onSuccess: (deletedRepo) => deleteRepoFromCache(deletedRepo),
    onError: (error) => {
      console.error(error);
      console.error("Error deleting repos");
    },
  });
  return mutate;
};

const deleteRepo = async (id) => {
  const res = await fetch(`/api/repos/${id}`, {
    method: "DELETE",
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

const updateProfile = async (profileToUpdate) => {
  const res = await fetch("/api/users/", {
    method: "PUT",
    body: JSON.stringify(profileToUpdate),
  });
  if (!res.ok) {
    throw new Error("error updating profile");
  }
  const userData = await res.json();
  return userData;
};