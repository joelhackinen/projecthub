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
import { useSetRecoilState } from "recoil";
import { infoState } from "../infoAtom.js";

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: queryMeFn,
    staleTime: Infinity,
  });
  return data;
};

export const useAddRepos = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (reposToAdd) => addRepos(reposToAdd),
    onMutate: () => {
      const id = setInfo("adding new projects");
      return { id };
    },
    onSettled: (repos, error, _, { id }) => {
      if (error) {
        setInfo("unexpected error", id, "error");
        return;
      }
      if (repos.added.length > 0) {
        addReposToCache(repos.added);
        setInfo(`${repos.added.length} projects added`, id, "success");
      }
      if (repos.errors.length > 0) {
        console.error(repos.errors);
        setInfo(`importing of ${repos.errors.length} projects failed`, id, "warning");
      }
    },
  });
  return [mutate, isPending];
};

export const useUpdateProfile = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (profileToUpdate) => updateProfile(profileToUpdate),
    onMutate: () => {
      const id = setInfo("updating profile");
      return { id };
    },
    onSuccess: (updatedProfile, _, { id }) => {
      updateUserToCache(updatedProfile);
      setInfo("profile updated", id, "success");
    },
    onError: (error, _, { id }) => {
      console.error(error);
      setInfo("profile updating failed", id, "error");
    },
  });
  return [mutate, isPending];
};

export const useUpdateRepo = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (repoToUpdate) => updateRepo(repoToUpdate),
    onMutate: () => {
      const id = setInfo("updating");
      return { id };
    },
    onSuccess: (updatedRepo, _, { id }) => {
      updateRepoToCache(updatedRepo);
      setInfo(`${updatedRepo.name} updated`, id, "success");
    },
    onError: (error, _, { id }) => {
      console.log(error);
      setInfo("updating project failed", id, "error");
    },
  });
  return [mutate, isPending];
};

export const useDeleteRepo = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (repoId) => deleteRepo(repoId),
    onMutate: () => {
      const id = setInfo("deleting project");
      return { id };
    },
    onSuccess: (deletedRepo, _, { id }) => {
      deleteRepoFromCache(deletedRepo);
      setInfo(`${deletedRepo.name} deleted`, id, "success");
    },
    onError: (error, _, { id }) => {
      console.error(error);
      setInfo("deleting project failed", id, "error");
    },
  });
  return [mutate, isPending];
};

export const useAddRepo = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (repoToAdd) => addRepo(repoToAdd),
    onMutate: () => {
      const id = setInfo("adding new project");
      return { id };
    },
    onSuccess: (addedRepo, _, { id }) => {
      addRepoToCache(addedRepo);
      setInfo(`${addedRepo.name} added`, id, "success");
    },
    onError: (error, _, { id }) => {
      console.error(error);
      setInfo("adding project failed", id, "error");
    },
  });
  return [mutate, isPending];
};

const useSetInfo = () => {
  const setState = useSetRecoilState(infoState);

  const setMessage = (message, id=null, severity="info") => {
    if (id) {
      setState(state => state.filter(s => s.id !== id));
    }
    const newId = self.crypto.randomUUID();
    setState(state => [...state, { message, severity, id: newId }]);

    setTimeout(() => {
      setState(state => state.filter(s => s.id !== newId));
    }, 3000);
    return newId;
  };
  return setMessage;
};
