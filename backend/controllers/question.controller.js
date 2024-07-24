const express = require('express');
const questionService = require('../services/question.service');
const { generateQuestionQuery, generateMultipleQuestionQuery } = require('../queries/question.queries');

const router = express.Router();

router.get('/test-ai', async (req, res) => {
  try {
    const chatCompletion = await questionService.testAI();
    res.json(chatCompletion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ask', async (req, res) => {
  const { title, description, topic, level, numOfQuestions } = req.body;

  const prompt = generateQuestionQuery(topic, level);

  try {
    const data = await questionService.generateQuestions(title, description, prompt, numOfQuestions, level);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ask-multiple', async (req, res) => {
  const { title, description, topic, level, numOfQuestions } = req.body;

  const prompt = generateMultipleQuestionQuery(topic, level, numOfQuestions);

  try {
    const data = await questionService.generateMultipleQuestionRequest(title + ' v1.0', description, prompt, level);
    if (data.error) {
      let error = data.error.message;
      if (error.length > 40) {
        error = error.splice(0, 40) + '...';
      }
      res.status(500).json({ error });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
