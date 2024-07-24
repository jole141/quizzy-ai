const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const nocache = require('nocache');
const questionController = require('./controllers/question.controller');
const quizController = require('./controllers/quiz.controller.ts');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.set('json spaces', 2);
app.use((req, res, next) => {
  res.contentType('application/json; charset=utf-8');
  next();
});
app.use(nocache());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  }),
);

// Routes
app.use('/question', questionController);
app.use('/api/quiz', quizController);

app.get('/', (req, res) => {
  res.json('OK');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
