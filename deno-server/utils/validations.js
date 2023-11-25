import {
  isString,
  required,
  lengthBetween,
  isBool,
  isDate,
  isEmail,
  maxLength,
  match,
  validate,
} from "../deps.js";
import { isLanguages } from "./index.ts";

const repoRules = {
  owner: [isString, maxLength(39)],
  name: [required, isString, lengthBetween(2, 30)],
  full_name: [isString, lengthBetween(2, 40)],
  description: [isString],
  languages: [isLanguages],
  html_url: [isString],
  created_at: [isDate],
  visible: [required, isBool],
};

const userEditRules = {
  firstname: [required, isString, lengthBetween(2, 30)],
  lastname: [required, isString, lengthBetween(2, 30)],
  email: [required, isEmail],
  url_name: [required, match("^[a-zA-Z0-9]*$"), isString, lengthBetween(3, 30)],
  about: [isString],
};

const registrationRules = {
  firstname: [required, isString, lengthBetween(2, 30)],
  lastname: [required, isString, lengthBetween(2, 30)],
  email: [required, isEmail],
  password: [required, isString, lengthBetween(6, 30)],
};

const loginRules = {
  email: [required],
  password: [required],
};

export const validateRepo = async (data) => {
  return await validate(data, repoRules, {
    messages: {
      "full_name": "project's full name must be 2-40 characters",
      "languages": "invalid languages",
      "html_url": "repository url of the project is invalid",
      "created_at": "invalid date format",
    },
  });
};

export const validateUserEdit = async (data) => {
  return await validate(data, userEditRules, {
    messages: {
      "firstname": "first name must be 2 to 30 characters long",
      "lastname": "last name must be 2 to 30 characters long",
      "email": "invalid email address",
      "url_name": "url must be alphanumeric and 3 to 30 characters long",
    },
  });
};

export const validateRegistration = async (data) => {
  return await validate(data, registrationRules, {
    messages: {
      "firstname": "first name must be 2 to 30 characters long",
      "lastname": "last name must be 2 to 30 characters long",
      "email": "invalid email address",
      "password": "password must be 6 to 30 characters long",
    },
  });
};

export const validateLogin = async (data) => {
  return await validate(data, loginRules);
};