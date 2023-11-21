import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
import {
  addReposToCache,
  addRepoToCache,
  deleteRepoFromCache,
  updateUserToCache,
  updateRepoToCache,
} from "../services/cacheUpdaters";
import { addRepo, addRepos, deleteRepo, updateRepo } from "../services/repos";
import { updateProfile } from "../services/profiles";

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
    mutationFn: (reposToAdd) => addRepos(reposToAdd),
    onSuccess: (repos) => {
      addReposToCache(repos.added);
      console.log(repos.errors);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return mutate;
};

export const useUpdateProfile = () => {
  const { mutate } = useMutation({
    mutationFn: (profileToUpdate) => updateProfile(profileToUpdate),
    onSuccess: (updatedProfile) => updateUserToCache(updatedProfile),
    onError: (error) => {
      console.error(error);
    },
  });
  return mutate;
};

export const useUpdateRepo = () => {
  const { mutate } = useMutation({
    mutationFn: (repoToUpdate) => updateRepo(repoToUpdate),
    onSuccess: (updatedRepo) => updateRepoToCache(updatedRepo),
    onError: (error) => {
      console.error(error);
    },
  });
  return mutate;
};

export const useDeleteRepo = () => {
  const { mutate } = useMutation({
    mutationFn: (repoId) => deleteRepo(repoId),
    onSuccess: (deletedRepo) => deleteRepoFromCache(deletedRepo),
    onError: (error) => {
      console.error(error);
    },
  });
  return mutate;
};

export const useAddRepo = () => {
  const { mutate } = useMutation({
    mutationFn: (repoToAdd) => addRepo(repoToAdd),
    onSuccess: (addedRepo) => addRepoToCache(addedRepo),
    onError: (error) => {
      console.log(error);
    },
  });
  return mutate;
};
