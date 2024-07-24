const OpenAI = require('openai');
const openaiConfiguration = require('../openai.config');
const quizService = require('../services/quiz.service');

const openai = new OpenAI(openaiConfiguration);

async function testAI() {
  try {
    return await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo',
    });
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

async function askAI(prompt, numOfQuestions) {
  try {
    let questions = [];
    const initMessage = { role: 'user', content: prompt };
    const followUpMessage = { role: 'user', content: 'Another one' };
    let conversation = [initMessage];
    for (let i = 0; i < numOfQuestions; i++) {
      const response = await openai.chat.completions.create({
        messages: conversation,
        model: 'gpt-3.5-turbo',
      });
      questions.push(response.choices[0].message.content);
      conversation.push(response.choices[0].message);
      conversation.push(followUpMessage);
    }
    return questions;
  } catch (error) {
    console.error(error.message);
    throw new Error('Internal Server Error');
  }
}

async function generateQuestions(title, description, prompt, numOfQuestions, quiz_level) {
  try {
    const aiGeneratedData = await askAI(prompt, numOfQuestions);
    const questions = aiGeneratedData.map((data, index) => {
      const jsonData = JSON.parse(data);
      jsonData.quiz_order_number = index;
      return jsonData;
    });
    const createdQuiz = await quizService.createQuiz({ title, description, quiz_level });
    const quizId = createdQuiz.id;
    await quizService.addQuestions(quizId, questions);
    return { id: quizId, title, description, questions };
  } catch (error) {
    console.error(error.message);
    throw new Error('Internal Server Error');
  }
}

async function generateMultipleQuestionRequest(title, description, prompt, quiz_level) {
  try {
    const initMessage = { role: 'user', content: prompt };
    let conversation = [initMessage];
    const response = await openai.chat.completions.create({
      messages: conversation,
      model: 'gpt-3.5-turbo',
      temperature: 1.3,
    });
    const aiGeneratedQuestions = JSON.parse(response.choices[0].message.content);
    const questions = aiGeneratedQuestions.map((question, index) => {
      question.quiz_order_number = index;
      return question;
    });
    const createdQuiz = await quizService.createQuiz({ title, description, quiz_level });
    const quizId = createdQuiz.id;
    await quizService.addQuestions(quizId, questions);
    return { id: quizId, title, description, questions };
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
}

module.exports = {
  testAI,
  generateQuestions,
  generateMultipleQuestionRequest,
};
