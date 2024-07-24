const db = require('../persistence/db.queries');
const OpenAI = require('openai');
const { generateAISuggestionsPrompt, nextQuizPrompt } = require('../queries/question.queries');
const openaiConfiguration = require('../openai.config');

const openai = new OpenAI(openaiConfiguration);

async function getAll() {
  var rows = await db.getAllQuizQuestions();
  return rows;
}

async function getById(id) {
  var quiz = await db.getQuizById(id);
  quizQuestions = await db.getQuestionsByQuizId(id);
  var score = await db.getQuizScore(id);
  quiz.questions = quizQuestions;
  return { ...quiz, score: score };
}

async function createQuiz(quiz) {
  var newQuiz = await db.createQuiz(quiz);
  return newQuiz;
}

async function updateQuiz(id, quiz) {
  var updatedQuiz = await db.updateQuiz(id, quiz);
  return updatedQuiz;
}

async function addQuestions(id, questions) {
  var newQuestions = [];
  questions.forEach(async question => {
    result = await db.addQuestion(id, question);
    newQuestions.push(result);
  });
  return newQuestions;
}

async function checkAnswers(quizId, answers) {
  var questions = await db.getQuestionsByQuizId(quizId);
  var quiz = await db.getQuizById(quizId);
  var result = [];
  var sortedQuestions = questions.sort((a, b) => a.quiz_order_number - b.quiz_order_number);
  var sortedAnswers = answers.sort((a, b) => a.quiz_order_number - b.quiz_order_number);
  var wrongQuestions = [];
  var wrongAnswers = [];
  sortedQuestions.forEach(question => {
    var answer = findAnswer(sortedAnswers, question.quiz_order_number);
    if (question.correct_answer === answer) {
      result.push({ question_order_number: question.quiz_order_number, correct: true, correct_answer: question.correct_answer });
    } else {
      wrongQuestions.push(question);
      wrongAnswers.push(answer !== null ? `Answer ${answer}` : 'No answer');
      result.push({ question_order_number: question.quiz_order_number, correct: false, correct_answer: question.correct_answer });
    }
  });
  await db.saveQuizScore(quizId, result.filter(question => question.correct).length / result.length);
  const suggestionPrompt = generateAISuggestionsPrompt(wrongQuestions, quiz.quiz_level, wrongAnswers);
  const suggestions = await generateAISuggestions(suggestionPrompt);

  let i = 0;
  for (const suggestion of suggestions) {
    result[wrongQuestions[i].quiz_order_number].suggestion = suggestion;
    i++;
  }
  return result;
}

async function generateAISuggestions(prompt) {
  const initMessage = { role: 'user', content: prompt };
  let conversation = [initMessage];
  const response = await openai.chat.completions.create({
    messages: conversation,
    model: 'gpt-3.5-turbo',
  });
  return JSON.parse(response.choices[0].message.content);
}

async function testSuggestions(id) {
  var questions = await db.getQuestionsByQuizId(id);
  return generateAISuggestions(questions);
}

function findAnswer(answers, orderNumber) {
  var answer = answers.find(answer => answer.quiz_order_number === orderNumber);
  if (answer === undefined) {
    return null;
  }
  return answer.answer;
}

async function generateNextQuiz(quizId, data) {
  const answers = data.answers;
  var questions = await db.getQuestionsByQuizId(quizId);
  var quiz = await db.getQuizById(quizId);
  var result = [];
  var sortedQuestions = questions.sort((a, b) => a.quiz_order_number - b.quiz_order_number);
  var sortedAnswers = answers.sort((a, b) => a.quiz_order_number - b.quiz_order_number);
  var wrongQuestions = [];
  var wrongAnswers = [];
  var correctQuestions = [];
  sortedQuestions.forEach(question => {
    var answer = findAnswer(sortedAnswers, question.quiz_order_number);
    if (question.correct_answer === answer) {
      result.push({ question_order_number: question.quiz_order_number, correct: true, correct_answer: question.correct_answer });
      correctQuestions.push(question);
    } else {
      wrongQuestions.push(question);
      wrongAnswers.push(answer !== null ? `Answer ${answer}` : 'No answer');
      result.push({ question_order_number: question.quiz_order_number, correct: false, correct_answer: question.correct_answer });
    }
  });
  const prompt = nextQuizPrompt(wrongQuestions, correctQuestions, quiz.quiz_level, wrongAnswers, 6);
  const initMessage = { role: 'user', content: prompt };
  let conversation = [initMessage];
  const response = await openai.chat.completions.create({
    messages: conversation,
    model: 'gpt-3.5-turbo',
    temperature: 1.3,
  });

  const aiGeneratedData = JSON.parse(response.choices[0].message.content);
  const newQuestions = aiGeneratedData.map((data, index) => {
    const jsonData = data;
    jsonData.quiz_order_number = index;
    return jsonData;
  });

  const title = quiz.title;
  const titleArray = title.split(' ');
  const lastElement = titleArray[titleArray.length - 1];
  const versionNumber = lastElement.split('.');
  const newVersionNumber = parseInt(versionNumber[0].slice(1)) + 1;
  titleArray[titleArray.length - 1] = `v${newVersionNumber}.0`;
  const newTitle = titleArray.join(' ');

  // TODO: add versioning to quiz if there is a new iteration
  const createdQuiz = await createQuiz({ title: newTitle, description: quiz.description, quiz_level: quiz.quiz_level });
  const newQuizId = createdQuiz.id;
  await addQuestions(newQuizId, newQuestions);
  return { id: newQuizId, title: newTitle, description: quiz.description, questions: newQuestions };
}
module.exports = {
  getAll,
  getById,
  createQuiz,
  updateQuiz,
  addQuestions,
  checkAnswers,
  testSuggestions,
  generateNextQuiz,
};
