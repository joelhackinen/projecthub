import { throwError } from "./errorHandler";

export const updateRepo = async (repoToUpdate) => {
  const res = await fetch(`/api/repos/${repoToUpdate.id}`, {
    method: "PUT",
    body: JSON.stringify(repoToUpdate),
  });
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  return data;
};

export const deleteRepo = async (id) => {
  const res = await fetch(`/api/repos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  return data;
};

export const addRepos = async (reposToAdd) => {
  const res = await fetch("/api/repos/many", {
    method: "POST",
    body: JSON.stringify(reposToAdd),
  });
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  return data;
};

export const addRepo = async (repoToAdd) => {
  const res = await fetch("/api/repos", {
    method: "POST",
    body: JSON.stringify(repoToAdd),
  });
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  return data;
};
