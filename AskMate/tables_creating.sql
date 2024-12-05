DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;


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
    FOREIGN KEY (user_id) REFERENCES users(id)
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
