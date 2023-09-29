CREATE TABLE test_table (
  id SERIAL PRIMARY KEY,
  stuff TEXT NOT NULL
);

INSERT INTO test_table (stuff) VALUES ('test stuff');
INSERT INTO test_table (stuff) VALUES ('more test stuff');