import { qclient } from "../../queryClient";

export const addReposToCache = (reposToAdd) => {
  let newRepos = reposToAdd;
  if (!Array.isArray(newRepos)) {
    newRepos = [newRepos];
  }

  let user_url;
  qclient.setQueryData(["whoami"], (oldData) => {
    user_url = oldData?.url_name ?? null;
    return { ...oldData, repos: [...oldData.repos, ...newRepos] };
  });

  if (user_url) {
    qclient.setQueryData(["profile", user_url], (oldProfile) => {
      return { ...oldProfile, repos: [...oldProfile.repos, ...newRepos.map(r => r.visible)] };
    });
  }
};

export const updateProfileToCache = (updatedProfile) => {
  qclient.setQueryData(["whoami"], updatedProfile);
  if (updatedProfile.url_name) {
    qclient.setQueryData(
      ["profile", updatedProfile.url_name],
      { ...updatedProfile, repos: updatedProfile.repos.filter(r => r.visible)}
    );
  }
};

export const deleteReposFromCache = (arrayOfIDs) => {
  let reposToDelete = arrayOfIDs;
  if (!Array.isArray(reposToDelete)) {
    reposToDelete = [arrayOfIDs];
  }
  let user_url;
  qclient.setQueryData(["whoami"], (oldData) => {
    user_url = oldData?.url_name ?? null;
    return { ...oldData, repos: oldData.repos.filter(r => arrayOfIDs.includes(r.id)) };
  })
  if (user_url) {
    qclient.setQueryData(
      ["profile", user_url],
      (oldData) => ({
        ...oldData,
        repos: oldData.repos.filter(r => arrayOfIDs.includes(r.id))
      })
    );
  }
};