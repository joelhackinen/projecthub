CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  pwhash TEXT NOT NULL,
  pwsalt TEXT NOT NULL,
  github TEXT,
  url_name TEXT UNIQUE,
  about TEXT
);

/*
email: test@test.com
password: password
*/
INSERT INTO users (firstname, lastname, email, pwhash, pwsalt, url_name) VALUES (
  'test',
  'test',
  'test@test.com',
  'c2NyeXB0AA4AAAAIAAAAAeMrpefBPiPMdWqpnIAmJJOVi7K6eV7fxV0rQel9bpYcrwcBxTMGJowmzV74XL+zrvmlsLFegzsLwXtvqhDkSRPOvO6paHHr6cnbVp3KFVj7',
  '416941844475d76a',
  'test'
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_email TEXT REFERENCES users(email) ON UPDATE CASCADE,
  owner TEXT,
  name TEXT NOT NULL,
  full_name TEXT,
  description TEXT,
  languages JSONB,
  html_url TEXT,
  created_at TEXT,
  visible BOOLEAN DEFAULT true NOT NULL,
  github BOOLEAN DEFAULT false NOT NULL,
  CONSTRAINT unique_user_project UNIQUE(user_email, name)
);
