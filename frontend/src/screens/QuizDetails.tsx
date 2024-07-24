import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkAnswers, getNextQuiz, getQuiz, IAnswer, IQuiz, IQuizResult } from '../../api/quizApi.tsx';
import { Loading } from '../components/Loading.tsx';
import Button from '../components/Button.tsx';
import AiIcon from '../assets/ai-icon.svg';
import { QuizLevel } from '../components/QuizLevel.tsx';
import ScoreLine from '../components/ScoreLine.tsx';

export const QuizDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState<IQuizResult[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [aiSuggestion, setAiSuggestion] = useState([false, false, false, false]);

  const [submittingAnswers, setSubmittingAnswers] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (params.id) {
        const data = await getQuiz(parseInt(params.id, 10));
        setQuiz(data);
      }
    };
    fetchQuiz();
  }, [params.id]);

  const handleStartQuiz = () => {
    setHasStarted(true);
  };

  const handleAnswerSelect = (questionNumber: number, selectedAnswer: string) => {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionNumber]: selectedAnswer,
    }));
  };

  const handleSubmitAnswers = async () => {
    const answers: IAnswer[] = Object.entries(selectedAnswers).map(([key, value]) => ({
      quiz_order_number: parseInt(key, 10),
      answer: value,
    }));
    try {
      setSubmittingAnswers(true);
      const score = await checkAnswers(answers, quiz!.id!);
      setScore(score.sort((a, b) => a.question_order_number - b.question_order_number));
    } catch (error) {
      console.log(error);
    } finally {
      setSubmittingAnswers(false);
    }
  };

  const handleDisplaySuggestion = (questionNumber: number) => {
    setAiSuggestion(prevSuggestions => ({
      ...prevSuggestions,
      [questionNumber]: !prevSuggestions[questionNumber],
    }));
  };

  // TODO: connect with a backend
  const handleNextQuiz = async () => {
    const answers: IAnswer[] = Object.entries(selectedAnswers).map(([key, value]) => ({
      quiz_order_number: parseInt(key, 10),
      answer: value,
    }));
    try {
      setSubmittingAnswers(true);
      const newQuiz = await getNextQuiz(quiz?.id || -1, answers);
      navigate(`/quiz/${newQuiz.id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmittingAnswers(false);
    }
  };

  if (quiz === null || submittingAnswers) {
    return <Loading />;
  }

  if (score !== null) {
    return (
      <div className="quiz-details-transparent">
        <h1>Results: {quiz?.title}</h1>
        {quiz?.questions &&
          quiz?.questions.map((question, index) => (
            <div key={index} className="question-container">
              <div className="quiz-question-text">
                <p>{question.question_text}</p>
              </div>
              <div className="answer-options">
                <label>
                  <strong>A:</strong> {question.answer_a}
                </label>
                <label>
                  <strong>B:</strong> {question.answer_b}
                </label>
                <label>
                  <strong>C:</strong> {question.answer_c}
                </label>
                <label>
                  <strong>D:</strong> {question.answer_d}
                </label>
              </div>
              <div className="answer-grade">
                <strong className="answer">Your answer: {selectedAnswers[index] || 'No answer'}</strong>
                <p>{score[index].correct ? <div className="correct">Correct!</div> : <div className="incorrect">Incorrect!</div>}</p>
                {!score[index].correct && <strong>(Correct answer: {score[index].correct_answer})</strong>}
              </div>
              {!score[index].correct && aiSuggestion[index as any] && (
                <div className="ai-suggestion-container">
                  <img src={AiIcon} alt="AI" className="ai-icon" />
                  <p>{score[index].suggestion}</p>
                </div>
              )}
              {!score[index].correct && (
                <div className="ai-suggestion-button">
                  <Button type={'secondary'} onClick={() => handleDisplaySuggestion(index)}>
                    AI Suggestion
                  </Button>
                </div>
              )}
            </div>
          ))}
        <div className="submit-answers-button">
          <Button type={'primary'} onClick={handleNextQuiz}>
            Next Quiz
          </Button>
        </div>
      </div>
    );
  }

  if (hasStarted) {
    return (
      <div className="quiz-details-transparent">
        <h1>{quiz?.title}</h1>
        {quiz?.questions &&
          quiz?.questions.map((question, index) => (
            <div key={index} className="question-container">
              <p className="quiz-question-text">{question.question_text}</p>
              <div className="answer-options">
                <label>
                  <input type="radio" name={`question_${index}`} value={question.answer_a} onChange={() => handleAnswerSelect(index, 'A')} />
                  {question.answer_a}
                </label>
                <label>
                  <input type="radio" name={`question_${index}`} value={question.answer_b} onChange={() => handleAnswerSelect(index, 'B')} />
                  {question.answer_b}
                </label>
                <label>
                  <input type="radio" name={`question_${index}`} value={question.answer_c} onChange={() => handleAnswerSelect(index, 'C')} />
                  {question.answer_c}
                </label>
                <label>
                  <input type="radio" name={`question_${index}`} value={question.answer_d} onChange={() => handleAnswerSelect(index, 'D')} />
                  {question.answer_d}
                </label>
              </div>
            </div>
          ))}
        <div className="submit-answers-button">
          <Button type={'primary'} onClick={handleSubmitAnswers}>
            Submit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-details">
      <div className="title-data">
        <h1>{quiz.title}</h1>
        {quiz.score && (
          <div className="score-container">
            <p>Average score:</p>
            <ScoreLine score={Number(quiz.score!)} />
          </div>
        )}
      </div>
      <div className="quiz-level">
        <QuizLevel level={quiz.quiz_level!} />
      </div>
      <p>{quiz.description}</p>
      <div className="homepage-start-buttons">
        <Button type={'secondary'} onClick={handleStartQuiz}>
          Try it out!
        </Button>
      </div>
    </div>
  );
};

export default QuizDetails;
