const { Client } = require('pg');

// Konfiguracija za povezivanje na PostgreSQL bazu
const dbConfig = {
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
};

async function getAllQuizQuestions() {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query('SELECT * FROM quiz');

    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getQuizById(id) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query('SELECT * FROM quiz WHERE id = $1', [id]);

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getQuestionsByQuizId(id) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query(
      'SELECT question_id, quiz_id, question_text, answer_a, answer_b, answer_c, answer_d, quiz_order_number FROM question WHERE quiz_id = $1',
      [id],
    );

    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function createQuiz(quiz) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query('INSERT INTO quiz (title, description, quiz_level) VALUES ($1, $2, $3) RETURNING *', [
      quiz.title,
      quiz.description,
      quiz.quiz_level,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function updateQuiz(id, quiz) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query('UPDATE quiz SET title = $1, description = $2 WHERE id = $3 RETURNING *', [quiz.title, quiz.description, id]);

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function addQuestion(id, question) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query(
      'INSERT INTO question (quiz_id, question_text, answer_a, answer_b, answer_c, answer_d, quiz_order_number, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        id,
        question.question_text,
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
        question.quiz_order_number,
        question.correct_answer,
      ],
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getQuestionsByQuizId(id) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query(
      'SELECT question_id, quiz_id, question_text, answer_a, answer_b, answer_c, answer_d, quiz_order_number, correct_answer FROM question WHERE quiz_id = $1 ORDER BY quiz_order_number ASC',
      [id],
    );

    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function saveQuizScore(quizId, score) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query('INSERT INTO score_logs (quiz_id, score) VALUES ($1, $2) RETURNING *', [quizId, score]);

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getQuizScore(quizId) {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query('SELECT ROUND(AVG(score), 2) as avg_score FROM score_logs WHERE quiz_id = $1 GROUP BY quiz_id', [quizId]);

    if (result.rows.length === 0) return undefined;

    return result.rows[0].avg_score;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = {
  getAllQuizQuestions,
  getQuizById,
  getQuestionsByQuizId,
  createQuiz,
  updateQuiz,
  addQuestion,
  getQuestionsByQuizId,
  saveQuizScore,
  getQuizScore,
};
