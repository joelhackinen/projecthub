import { qclient } from "../queryClient";
import { updateProfileToCache, updateFullProfileToCache } from "./cacheUpdaters";

export const whoAmI = async () => {
  return await qclient.fetchQuery({
    queryKey: ["whoami"],
    queryFn: queryMeFn,
    staleTime: Infinity,
  });
};

export const queryMeFn = async () => {
  const res = await fetch("/api/whoami");
  if (!res.ok) {
    return null;
  }
  return await res.json();
};

export const login = async (email, password) => {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.errors);
  }
  updateFullProfileToCache(data);
  return data;
};

export const logout = async () => {
  const res = await fetch("/api/logout", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("user not logged in");
  }
  qclient.removeQueries({ queryKey: ["whoami"] });
};

export const register = async (firstname, lastname, email, password) => {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstname,
      lastname,
      email,
      password,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.errors);
  }
  updateFullProfileToCache(data)
  return data;
};

export const verifyGithubUser = async (code) => {
  const userRes = await fetch("/api/github/verifyUser", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  const data = await userRes.json();
  if (!userRes.ok) {
    throw new Error(data?.error);
  }
  const oldData = qclient.getQueryData(["whoami"]);
  updateFullProfileToCache({ ...oldData, github: data.login });

  const repoRes = await fetch("/api/github/fetchRepos", {
    method: "POST",
    body: JSON.stringify({ github_token: data.github_token }),
  });

  const repoData = await repoRes.json();
  return repoData;
};