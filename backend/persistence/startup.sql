CREATE TABLE IF NOT EXISTS quiz (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
    );

CREATE TABLE IF NOT EXISTS question (
    question_id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_a TEXT NOT NULL,
    answer_b TEXT NOT NULL,
    answer_c TEXT NOT NULL,
    answer_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    quiz_order_number INT
    );

ALTER TABLE question ADD CONSTRAINT quiz_id_quiz_order_number_unique UNIQUE (quiz_id, quiz_order_number);

ALTER TABLE quiz ADD COLUMN quiz_level VARCHAR(32) NOT NULL DEFAULT 'Middle school';

CREATE TABLE score_logs (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);