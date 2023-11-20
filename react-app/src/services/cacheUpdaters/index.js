import { qclient } from "../../queryClient";

export const addReposToCache = (reposToAdd) => {
  let newRepos = reposToAdd;
  if (!Array.isArray(newRepos)) {
    newRepos = [newRepos];
  }

  qclient.setQueryData(["whoami"], (oldData) => ({
    ...oldData,
    repos: [...oldData.repos, ...newRepos],
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
