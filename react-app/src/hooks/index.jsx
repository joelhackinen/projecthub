import { useMutation, useQuery } from "@tanstack/react-query";
import { queryMeFn } from "../services/auth";
import {
  addReposToCache,
  deleteRepoFromCache,
  updateUserToCache,
  updateRepoToCache,
} from "../services/cacheUpdaters";
import { addRepos, deleteRepo, updateRepo } from "../services/repos";
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
    mutationFn: (repos) => addRepos(repos),
    onSuccess: (repos) => addReposToCache(repos),
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
