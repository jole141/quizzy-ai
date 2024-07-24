const express = require('express');
const quizService = require('../services/quiz.service');

const router = express.Router();

router.get('/', async (req, res) => {
  var rows = await quizService.getAll();
  res.send(rows);
});

router.get('/:id', async (req, res) => {
  var rows = await quizService.getById(req.params.id);
  res.send(rows);
});

router.post('/', async (req, res) => {
  req.body.title += ' v1.0';
  var rows = await quizService.createQuiz(req.body);
  res.send(rows);
});

router.put('/:id', async (req, res) => {
  var rows = await quizService.updateQuiz(req.params.id, req.body);
  res.send(rows);
});

router.post('/:id/add-questions', async (req, res) => {
  var rows = await quizService.addQuestions(req.params.id, req.body);
  res.send(rows);
});

router.post('/:id/check-answers', async (req, res) => {
  var rows = await quizService.checkAnswers(req.params.id, req.body);
  res.send(rows);
});

router.post('/:id/next-quiz', async (req, res) => {
  var rows = await quizService.generateNextQuiz(req.params.id, req.body);
  res.send(rows);
});

router.get('/test/:id', async (req, res) => {
  var rows = await quizService.testSuggestions(req.params.id);
  res.send(rows);
});

module.exports = router;
