import { qclient } from "../queryClient";

export const fetchProfile = async (url_name) => {
  return await qclient.fetchQuery({
    queryKey: ["profile", url_name],
    queryFn: async () => {
      const res = await fetch(`/api/users/${url_name}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "profile fetching failed");
      }
      return data;
    },
    staleTime: Infinity,
  });
};

export const updateProfile = async (updatedProfile) => {
  const res = await fetch("/api/users/", {
    method: "PUT",
    body: JSON.stringify(updatedProfile),
  });
  const newData = await res.json();
  if (!res.ok) {
    throw new Error(newData?.error ?? "updating the profile failed");
  }
  qclient.setQueryData(
    ["profile", newData.url_name],
    { ...newData, repos: newData.repos.filter(r => r.visible === true)
  });
  qclient.setQueryData(["whoami"], newData);
  return data;
};

export const postRepos = async (reposToAdd) => {
  const res = await fetch("/api/repos", {
    method: "POST",
    body: JSON.stringify(reposToAdd),
  });
  if (!res.ok) {
    throw new Error("error adding repos");
  }
  return await res.json();
};

export const addReposToCache = (newRepos) => {
  let user_url;
  qclient.setQueryData(["whoami"], (oldData) => {
    user_url = oldData?.url_name ?? null;
    return { ...oldData, repos: [...oldData.repos, ...newRepos] };
  });

  if (user_url) {
    qclient.setQueryData(["profile", user_url], (oldProfile) => {
      return { ...oldProfile, repos: [...oldProfile.repos, ...newRepos.map(r => r.visible === true)] };
    });
  }
};