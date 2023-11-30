import { qclient } from "../queryClient";
import { setUserToCache, updateUserToCache } from "./cacheUpdaters";
import { throwError } from "./errorHandler";

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
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  setUserToCache(data);
  return data;
};

export const logout = async () => {
  await fetch("/api/logout", {
    method: "POST",
  });
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
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  setUserToCache(data);
  return data;
};

export const verifyGithubUser = async (code) => {
  const userRes = await fetch("/api/github/verifyUser", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  if (!userRes.ok) {
    await throwError(userRes);
  }
  const userData = await userRes.json();
  const { login, github_token } = userData;
  const oldData = qclient.getQueryData(["whoami"]);
  updateUserToCache({ ...oldData, github: login });

  const repoRes = await fetch(`/api/github/fetchRepos?github_token=${github_token}`);
  if (!repoRes.ok) {
    await throwError(repoRes);
  }
  const repoData = await repoRes.json();
  return repoData;
};
