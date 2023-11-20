export const fetchProfile = async (url_name) => {
  const res = await fetch(`/api/users/${url_name}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "profile fetching failed");
  }
  return data;
};

export const updateProfile = async (profileToUpdate) => {
  const res = await fetch("/api/users/", {
    method: "PUT",
    body: JSON.stringify(profileToUpdate),
  });
  if (!res.ok) {
    throw new Error("error updating profile");
  }
  const userData = await res.json();
  return userData;
};
