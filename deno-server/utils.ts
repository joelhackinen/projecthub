import { invalid, SecureCookieMap, create, getNumericDate } from "./deps.js";
import { key } from "./app.js";

// omit keys from object
export const omit = <T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> => {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
};

// check if is object
export const isObject = (obj: unknown): obj is Record<string, unknown> => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj) || obj instanceof Array) {
    return false;
  }
  for (const key in obj) {
    if (typeof key !== "string") {
      return false;
    }
  }
  return true;
};

// languages validation rule
export const isLanguages = (obj: unknown) => {
  if (!isObject(obj)) {
    return invalid("isLanguages", { obj });
  }
  if (!Object.keys(obj).every(key => typeof obj[key] === "number")) {
    return invalid("isLanguages", { obj });
  }
};

// ISO 8601 to YYYY-MM-DD
export const isoToDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// create JWT and set it in a cookie
export const setJWT = async (email: string, cookies: SecureCookieMap) => {
  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    { email, exp: getNumericDate(60 * 60 * 24) },
    key,
  );
  await cookies.set("token", jwt, { httpOnly: true });
};