import { qclient } from "../queryClient";

export const whoAmI = async () => {
  return await qclient.fetchQuery({
    queryKey: ["whoami"],
    queryFn: queryUserFn,
    staleTime: Infinity,
  });
};

export const queryUserFn = async () => {
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
  qclient.setQueryData(["whoami"], data);
  return data;
};

export const logout = async () => {
  const res = await fetch("/api/logout", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("user not logged in");
  }
  qclient.invalidateQueries(["whoami"]);
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
  qclient.setQueryData(["whoami"], data);
  return data;
};