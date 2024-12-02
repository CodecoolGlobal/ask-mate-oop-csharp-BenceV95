CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email_address VARCHAR(100) NOT NULL,
    reg_time TIMESTAMP NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE questions (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL,
    body TEXT NOT NULL,
    post_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE answers (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL,
    question_id VARCHAR(32) NOT NULL,
	body TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
