import { invalid } from "./deps.js";

// omit keys from object or postgres.Row
export const omit = (obj, ...keys) => {
  const { ...rest } = obj;
  for (const key of keys) {
    delete rest[key];
  }
  return rest;
};

// languages validation rule
export const isLanguages = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return invalid("isLanguages", { obj });
  }
  if (!Object.keys(obj).every(key => typeof obj[key] === "number")) {
    return invalid("isLanguages", { obj });
  }
};

// ISO 8601 to YYYY-MM-DD
export const isoToDate = (isoDateString) => {
  const date = new Date(isoDateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
