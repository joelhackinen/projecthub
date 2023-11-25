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
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

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
      const id = setInfo({ nessages: ["adding new projects"] });
      return { id };
    },
    onSettled: (repos, error, _, { id }) => {
      if (error) {
        setInfo({
          messages: ["unexpected error"],
          id,
          severity: "error"
        });
        return;
      }
      if (repos.added.length > 0) {
        addReposToCache(repos.added);
        setInfo({
          messages: [`${repos.added.length} projects added`],
          id,
          severity: "success",
        });
      }
      if (repos.errors.length > 0) {
        setInfo({
          messages: [`importing of ${repos.errors.length} projects failed`],
          id,
          severity: "warning",
        });
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
      const id = setInfo({ messages: ["updating profile"] });
      return { id };
    },
    onSuccess: (updatedProfile, _, { id }) => {
      updateUserToCache(updatedProfile);
      setInfo({
        messages: ["profile updated"],
        id,
        severity: "success",
      });
    },
    onError: (error, _, { id }) => {
      setInfo({
        messages: error.messages,
        id,
        severity: "error",
      });
    },
  });
  return [mutate, isPending];
};

export const useUpdateRepo = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (repoToUpdate) => updateRepo(repoToUpdate),
    onMutate: () => {
      const id = setInfo({ messages: ["updating"] });
      return { id };
    },
    onSuccess: (updatedRepo, _, { id }) => {
      updateRepoToCache(updatedRepo);
      setInfo({
        messages: [`${updatedRepo.name} updated`],
        id,
        severity: "success",
      });
    },
    onError: (error, _, { id }) => {
      setInfo({
        messages: error.message,
        id,
        severity: "error"
      });
    },
  });
  return [mutate, isPending];
};

export const useDeleteRepo = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (repoId) => deleteRepo(repoId),
    onMutate: () => {
      const id = setInfo({ messages: ["deleting project"] });
      return { id };
    },
    onSuccess: (deletedRepo, _, { id }) => {
      deleteRepoFromCache(deletedRepo);
      setInfo({
        messages:[`${deletedRepo.name} deleted`],
        id,
        severity: "success"},
      );
    },
    onError: (error, _, { id }) => {
      setInfo(error.messages, id, "error");
    },
  });
  return [mutate, isPending];
};

export const useAddRepo = () => {
  const setInfo = useSetInfo();
  const { mutate, isPending } = useMutation({
    mutationFn: (repoToAdd) => addRepo(repoToAdd),
    onMutate: () => {
      const id = setInfo({ messages: ["adding new project"] });
      return { id };
    },
    onSuccess: (addedRepo, _, { id }) => {
      addRepoToCache(addedRepo);
      setInfo({
        messages: [`${addedRepo.name} added`],
        id,
        severity: "success",
      });
    },
    onError: (error, _, { id }) => {
      setInfo({
        messages: error.messages,
        id,
        severity: "error",
      });
    },
  });
  return [mutate, isPending];
};

export const useSetInfo = () => {
  const setState = useSetRecoilState(infoState);
  const timeoutRef = useRef({});

  // messages: string[] --- message(s) to show
  // id: string         --- identifier of the action that triggered the notification chain
  const setMessage = ({ messages, id=uuid(), severity="info" }) => {
    setState((state) => {
      const newState = state.filter((s) => s.id !== id);
      return newState.concat({ messages, severity, id });
    });
    
    if (timeoutRef.current[id]) {
      clearTimeout(timeoutRef.current[id]);
    }

    timeoutRef.current[id] = setTimeout(() => {
      setState(state => state.filter(s => s.id !== id));
      timeoutRef.current[id] = null;
    }, 3000);
    return id;
  };

  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);
  return setMessage;
};
