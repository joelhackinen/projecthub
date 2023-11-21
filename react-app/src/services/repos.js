export const updateRepo = async (repoToUpdate) => {
  const res = await fetch(`/api/repos/${repoToUpdate.id}`, {
    method: "PUT",
    body: JSON.stringify(repoToUpdate),
  });
  if (!res.ok) {
    throw new Error("error updating repo");
  }
  return await res.json();
};

export const deleteRepo = async (id) => {
  const res = await fetch(`/api/repos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("error deleting repos");
  }
  return await res.json();
};

export const addRepos = async (reposToAdd) => {
  const res = await fetch("/api/repos/many", {
    method: "POST",
    body: JSON.stringify(reposToAdd),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "error adding repos");
  }
  return data;
};

export const addRepo = async (repoToAdd) => {
  const res = await fetch("/api/repos", {
    method: "POST",
    body: JSON.stringify(repoToAdd),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "error adding repo");
  }
  return data;
}
