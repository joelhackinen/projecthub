import { throwError } from "./errorHandler";

export const fetchProfile = async (url_name) => {
  const res = await fetch(`/api/users/${url_name}`);
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  return data;
};

export const updateProfile = async (profileToUpdate) => {
  const res = await fetch("/api/users/", {
    method: "PUT",
    body: JSON.stringify(profileToUpdate),
  });
  if (!res.ok) {
    await throwError(res);
  }
  const data = await res.json();
  return data;
};
