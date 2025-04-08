-- Generate Users (10 users)
INSERT INTO users (id, username, email_address, reg_time, password, salt, isAdmin)
VALUES
    ('user1', 'john_doe', 'john@example.com', NOW(), 'password1', 'salt1', FALSE),
    ('user2', 'jane_smith', 'jane@example.com', NOW(), 'password2', 'salt2', FALSE),
    ('user3', 'alice_williams', 'alice@example.com', NOW(), 'password3', 'salt3', FALSE),
    ('user4', 'bob_johnson', 'bob@example.com', NOW(), 'password4', 'salt4', FALSE),
    ('user5', 'carol_martin', 'carol@example.com', NOW(), 'password5', 'salt5', FALSE),
    ('user6', 'david_brown', 'david@example.com', NOW(), 'password6', 'salt6', FALSE),
    ('user7', 'eva_davis', 'eva@example.com', NOW(), 'password7', 'salt7', FALSE),
    ('user8', 'frank_moore', 'frank@example.com', NOW(), 'password8', 'salt8', FALSE),
    ('user9', 'george_clark', 'george@example.com', NOW(), 'password9', 'salt9', FALSE),
    ('user10', 'hannah_lee', 'hannah@example.com', NOW(), 'password10', 'salt10', FALSE);

-- Generate Questions (20 questions)
INSERT INTO questions (id, user_id, body, title, post_date, categories)
VALUES
    ('q1', 'user1', 'What is the best programming language?', 'Best programming language?', NOW(), 11),
    ('q2', 'user2', 'How can I improve my coding skills?', 'Improving coding skills', NOW(), 11),
    ('q3', 'user3', 'What are the health benefits of yoga?', 'Yoga and health', NOW(), 9),
    ('q4', 'user4', 'How do I start a business?', 'Starting a business', NOW(), 3),
    ('q5', 'user5', 'What is quantum computing?', 'Quantum computing explained', NOW(), 16),
    ('q6', 'user6', 'What is climate change?', 'Understanding climate change', NOW(), 7),
    ('q7', 'user7', 'How do I cook a perfect steak?', 'Cooking steak', NOW(), 8),
    ('q8', 'user8', 'What is machine learning?', 'Introduction to machine learning', NOW(), 11),
    ('q9', 'user9', 'What are the best travel destinations in 2025?', 'Best travel destinations', NOW(), 20),
    ('q10', 'user10', 'How to get started with cryptocurrency?', 'Cryptocurrency basics', NOW(), 15),
    ('q11', 'user1', 'What are the benefits of meditation?', 'Meditation benefits', NOW(), 9),
    ('q12', 'user2', 'How to become a good leader?', 'Leadership skills', NOW(), 3),
    ('q13', 'user3', 'What are the best practices for web development?', 'Web development practices', NOW(), 11),
    ('q14', 'user4', 'How can I stay productive during the day?', 'Staying productive', NOW(), 9),
    ('q15', 'user5', 'What is the role of AI in healthcare?', 'AI in healthcare', NOW(), 16),
    ('q16', 'user6', 'How do I manage stress effectively?', 'Managing stress', NOW(), 9),
    ('q17', 'user7', 'What is the future of electric cars?', 'Electric car future', NOW(), 2),
    ('q18', 'user8', 'How do I start investing in the stock market?', 'Stock market investing', NOW(), 3),
    ('q19', 'user9', 'What are the best places to visit in Europe?', 'Best places in Europe', NOW(), 20),
    ('q20', 'user10', 'How do I make my website SEO-friendly?', 'SEO for websites', NOW(), 11);

-- Generate Answers (10 answers)
INSERT INTO answers (id, user_id, question_id, body, post_date, is_accepted)
VALUES
    ('a1', 'user1', 'q1', 'JavaScript is the best programming language for web development.', NOW(), FALSE),
    ('a2', 'user2', 'q1', 'Python is best for data science and AI.', NOW(), FALSE),
    ('a3', 'user3', 'q2', 'Practice consistently and work on projects.', NOW(), FALSE),
    ('a4', 'user4', 'q3', 'Yoga helps with flexibility and mental peace.', NOW(), TRUE),
    ('a5', 'user5', 'q4', 'Start with a business plan and market research.', NOW(), FALSE),
    ('a6', 'user6', 'q5', 'Quantum computing is a new paradigm in computing that uses quantum bits.', NOW(), FALSE),
    ('a7', 'user7', 'q6', 'Climate change is the result of human activity affecting the planet’s climate.', NOW(), TRUE),
    ('a8', 'user8', 'q7', 'To cook a perfect steak, make sure the meat is at room temperature before cooking.', NOW(), FALSE),
    ('a9', 'user9', 'q8', 'Machine learning is a subset of AI where systems learn from data without explicit programming.', NOW(), TRUE),
    ('a10', 'user10', 'q9', 'Some of the best travel destinations include Japan, New Zealand, and Iceland.', NOW(), FALSE);

-- Generate Votes (15 votes)
INSERT INTO votes (is_useful, user_id, answer_id)
VALUES
    (TRUE, 'user1', 'a1'),
    (TRUE, 'user2', 'a3'),
    (FALSE, 'user3', 'a2'),
    (TRUE, 'user4', 'a5'),
    (FALSE, 'user5', 'a6'),
    (TRUE, 'user6', 'a7'),
    (FALSE, 'user7', 'a8'),
    (TRUE, 'user8', 'a9'),
    (TRUE, 'user9', 'a10'),
    (TRUE, 'user10', 'a1'),
    (TRUE, 'user1', 'a7'),
    (TRUE, 'user2', 'a8'),
    (FALSE, 'user3', 'a9'),
    (TRUE, 'user4', 'a4'),
    (FALSE, 'user5', 'a10');

