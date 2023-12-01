import { qclient } from "../../queryClient";

export const addReposToCache = (reposToAdd) => {
  qclient.setQueryData(["whoami"], (oldData) => ({
    ...oldData,
    repos: [...oldData.repos, ...reposToAdd],
  }));
};

export const addRepoToCache = (addedRepo) => {
  qclient.setQueryData(["whoami"], (oldData) => ({
    ...oldData,
    repos: [...oldData.repos, addedRepo],
  }));
};

export const setUserToCache = (updatedProfile) => {
  qclient.setQueryData(["whoami"], updatedProfile);
};

export const updateUserToCache = (updatedProfile) => {
  qclient.setQueryData(["whoami"], (oldData) => ({
    ...updatedProfile,
    repos: oldData.repos,
  }));
};

export const updateRepoToCache = (updatedRepo) => {
  qclient.setQueryData(["whoami"], (oldData) => ({
    ...oldData,
    repos: oldData.repos.map((r) =>
      r.id === updatedRepo.id ? updatedRepo : r,
    ),
  }));
};

export const deleteRepoFromCache = (deletedRepo) => {
  qclient.setQueryData(["whoami"], (oldData) => ({
    ...oldData,
    repos: oldData.repos.filter((r) => r.id !== deletedRepo.id),
  }));
};
