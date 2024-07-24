const generateQuestionQuery = (topic, level) => {
  return `
      Write me random questions about ${topic} on ${level} level
      and offer me 4 different answers, one of which is the correct one to the given question.
      Write the question and the possible answers in the following JSON format and do not write anything except the JSON object:
      {
      question_text: (replace with actual question),
      answer_a: (replace with actual answer),
      answer_b: (replace with actual answer),
      answer_c: (replace with actual answer),
      answer_d: (replace with actual answer),
      correct_answer: (replace with "A", "B", "C" or "D")
      }
    `;
};

const getContextFromLevel = level => {
  if (level === 'Elementary school') {
    return 'Think of some basic questions for someone who is just learning this topic.';
  }
  if (level === 'Middle school') {
    return 'Think of some question that are harder to answer for someone with basic knowledge but not hard enough for someone who is an expert.';
  }
  if (level === 'University') {
    return 'Think of some complex questions that are harder to answer.';
  }
  return '';
};

const generateMultipleQuestionQuery = (topic, level, numberOfQuestions) => {
  const context = getContextFromLevel(level);

  return `
      Write me random questions about ${topic} on ${level} level
      and offer me 4 different answers, one of which is the correct one to the given question.
      ${context}
      Write the exact ${numberOfQuestions} questions and the possible answers in the following JSON format and do not write anything except the JSON object:
      [{
      question_text: (replace with actual question),
      answer_a: (replace with actual answer),
      answer_b: (replace with actual answer),
      answer_c: (replace with actual answer),
      answer_d: (replace with actual answer),
      correct_answer: (replace with "A", "B", "C" or "D")
      }, ...]
    `;
};

const generateAISuggestionsPrompt = (questions, level, answers) => {
  let prompt = '';
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answered = answers[i];
    prompt += formatQuestion(question, answered, level) + '\n';
  }
  prompt += `
    Write the exact format of explanations following Array format and do not write anything except the Array object 
    (array should contains the same number of string as the number of questions, sorted in the same order as the questions,
    do not use any extra attributes, just one string, if question is not answered, just try to explain why the correct answer is correct).
    Only return array, do not start with any other text, just the array:
    
    [(replace with actual explanation), ...]
    
    This is an example of the correct format:
    ["Some explanation", "Some other explanation", "Another explanation", ...]
  `;
  return prompt;
};

const formatQuestion = (question, answered, level) => {
  return `
    Question: ${question.question_text}
    Answer A: ${question.answer_a}
    Answer B: ${question.answer_b}
    Answer C: ${question.answer_c}
    Answer D: ${question.answer_d}
    Correct Answer: ${question.correct_answer}
    Someone answered '${answered}' for this question. Explain it to them friendly and tailor your answer for someone on a ${level} level.
    `;
};

const formatWrongQuestion = (question, answered) => {
  return `
    Question: ${question.question_text}
    Answer A: ${question.answer_a}
    Answer B: ${question.answer_b}
    Answer C: ${question.answer_c}
    Answer D: ${question.answer_d}
    Correct Answer: ${question.correct_answer}
    Answered: ${answered}
    `;
};

const nextQuizPrompt = (questions, avoidQuestions, level, answers, numberOfQuestions) => {
  let prompt = '';
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answered = answers[i];
    prompt += formatWrongQuestion(question, answered) + '\n';
  }
  const context = getContextFromLevel(level);

  prompt += `
  These are the incorrectly answered questions in the quiz. Therefore, it is necessary to generate the next quiz, 
  aiming to improve the user's knowledge by creating a quiz that consists of 60% questions based on these incorrectly 
  answered questions (questions must not be the same; they should be variations or related to the same topic, but never the same). 
  The remaining 40% of questions must be new questions. Based on the above-mentioned questions write me random questions 
  about same topic on ${level} level and offer me 4 different answers, one of which is the correct one to the given question.
  ${context}
  Write the exact ${numberOfQuestions} questions and the possible answers in the following JSON format and do not write anything except the JSON object:
  [{
  question_text: (replace with actual question),
  answer_a: (replace with actual answer),
  answer_b: (replace with actual answer),
  answer_c: (replace with actual answer),
  answer_d: (replace with actual answer),
  correct_answer: (replace with "A", "B", "C" or "D")
  }, ...]
  `;

  if (avoidQuestions.length !== 0) {
    prompt += '\n\n Please avoid these questions because they were already asked: \n\n';
    for (let i = 0; i < avoidQuestions.length; i++) {
      const question = avoidQuestions[i];
      prompt += `
    Question: ${question.question_text}
    Answer A: ${question.answer_a}
    Answer B: ${question.answer_b}
    Answer C: ${question.answer_c}
    Answer D: ${question.answer_d}
    Correct Answer: ${question.correct_answer}
    `;
    }
  }

  return prompt;
};

module.exports = { generateQuestionQuery, generateMultipleQuestionQuery, generateAISuggestionsPrompt, nextQuizPrompt };
