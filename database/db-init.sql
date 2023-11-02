CREATE TABLE test_table (
  id SERIAL PRIMARY KEY,
  stuff TEXT NOT NULL
);

INSERT INTO test_table (stuff) VALUES ('test stuff');
INSERT INTO test_table (stuff) VALUES ('more test stuff');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  pwhash TEXT NOT NULL,
  pwsalt TEXT NOT NULL,
  github TEXT,
  url_name TEXT UNIQUE
);

/*
email: test@test.com
password: password
*/
INSERT INTO users (firstname, lastname, email, pwhash, pwsalt) VALUES (
  'test',
  'test',
  'test@test.com',
  'c2NyeXB0AA4AAAAIAAAAAeMrpefBPiPMdWqpnIAmJJOVi7K6eV7fxV0rQel9bpYcrwcBxTMGJowmzV74XL+zrvmlsLFegzsLwXtvqhDkSRPOvO6paHHr6cnbVp3KFVj7',
  '416941844475d76a'
);