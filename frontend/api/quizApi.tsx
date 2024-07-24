import axios from 'axios';

// TODO: Change this to the real API endpoint, use env variables
const quizApiEndpoint = 'http://localhost:3000/api/quiz';
const aiApiEndpoint = 'http://localhost:3000/question';

export interface IQuiz {
  title: string;
  description: string;
  id?: number;
  questions?: IQuestion[];
  quiz_level?: string;
  score?: string;
  error?: string;
}

export interface IQuestion {
  question_text: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  quiz_order_number: number;
  correct_answer: string;
}

export interface IAnswer {
  quiz_order_number: number;
  answer: string;
}

export interface IQuizResult {
  question_order_number: number;
  correct: boolean;
  correct_answer: string;
  suggestion?: string;
}

export interface IQuizAI {
  title: string;
  description: string;
  level: string;
  topic: string;
  numOfQuestions: number;
}

export const createQuiz = async (quiz: IQuiz): Promise<IQuiz> => {
  const response = await axios.post(quizApiEndpoint, quiz);
  return response.data;
};

export const createQuizUsingAI = async (quiz: IQuizAI): Promise<IQuiz> => {
  const response = await axios.post(`${aiApiEndpoint}/ask-multiple`, quiz);
  return response.data;
};

export const addQuestions = async (questions: IQuestion[], id: number): Promise<void> => {
  await axios.post(`${quizApiEndpoint}/${id}/add-questions`, questions);
};

export const getQuizzes = async (): Promise<IQuiz[]> => {
  const response = await axios.get(quizApiEndpoint);
  return response.data;
};

export const getQuiz = async (id: number): Promise<IQuiz> => {
  const response = await axios.get(`${quizApiEndpoint}/${id}`);
  return response.data;
};

export const checkAnswers = async (answers: IAnswer[], id: number): Promise<IQuizResult[]> => {
  const response = await axios.post(`${quizApiEndpoint}/${id}/check-answers`, answers);
  return response.data;
};

export const getNextQuiz = async (id: number, answers: IAnswer[]): Promise<IQuiz> => {
  const response = await axios.post(`${quizApiEndpoint}/${id}/next-quiz`, { answers });
  return response.data;
};
