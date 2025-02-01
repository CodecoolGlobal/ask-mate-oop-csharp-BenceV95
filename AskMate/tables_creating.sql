DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS votes;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    reg_time TIMESTAMP NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt BYTEA NOT NULL
);

CREATE TABLE questions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    post_date TIMESTAMP NOT NULL,
    categories INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (categories) REFERENCES categories(id)
);

CREATE TABLE answers (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    question_id VARCHAR(255) NOT NULL,
	body TEXT NOT NULL,
    post_date TIMESTAMP NOT NULL,
    is_accepted BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    is_useful BOOLEAN NOT NULL,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answer_id VARCHAR(255) NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    UNIQUE (answer_id, user_id)
);


-- add isAdmin column to users, set constraint NOT NULL
--ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT FALSE;

--ALTER TABLE users ALTER COLUMN isAdmin SET NOT NULL;