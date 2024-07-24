import { FC, useState } from 'react';
import Button from './Button.tsx';
import { addQuestions, createQuiz, createQuizUsingAI, IQuestion } from '../../api/quizApi.tsx';
import { useNavigate } from 'react-router-dom';
import { Loading } from './Loading.tsx';

export const Quiz: FC = () => {
  const navigate = useNavigate();
  const initialQuestion = {
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  };
  const levelOptions = ['Elementary school', 'Middle school', 'University'];

  const [questions, setQuestions] = useState([initialQuestion]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState(0);
  const [topic, setTopic] = useState('');
  const [numOfQuestions, setNumOfQuestions] = useState(3);
  const [isCreating, setIsCreating] = useState(false);
  const [alert, setAlert] = useState('');
  const [selectedOption, setSelectedOption] = useState(0);

  const addQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, initialQuestion]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(prevQuestions => prevQuestions.filter((_, index) => index !== questionIndex));
  };

  const handleTextChange = (questionIndex: number, text: string) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].text = text;
      return newQuestions;
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].options[optionIndex] = value;
      return newQuestions;
    });
  };

  const handleCorrectAnswerChange = (questionIndex: number, correctAnswer: number) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].correctAnswer = correctAnswer;
      return newQuestions;
    });
  };

  const validateQuiz = () => {
    if (title === '') {
      setAlert('Please enter a title.');
      return false;
    }
    if (description === '') {
      setAlert('Please enter a description.');
      return false;
    }
    if (selectedOption === 0) {
      if (topic === '') {
        setAlert('Please enter a topic.');
        return false;
      }
      if (isNaN(numOfQuestions) || numOfQuestions < 1 || numOfQuestions > 10) {
        setAlert('Please enter a number of questions between 1 and 10 inclusive.');
        return false;
      }
    } else {
      if (questions.length < 1) {
        setAlert('Please enter at least one question.');
        return false;
      }
      const hasEmptyQuestion = questions.some(question => question.text === '');
      if (hasEmptyQuestion) {
        setAlert('Please fill in all questions.');
        return false;
      }
      const hasEmptyOption = questions.some(question => question.options.some(option => option === ''));
      if (hasEmptyOption) {
        setAlert('Please fill in all options.');
        return false;
      }
      const hasCorrectAnswer = questions.some(question => question.correctAnswer === -1);
      if (hasCorrectAnswer) {
        setAlert('Please select a correct answer for each question.');
        return false;
      }
    }
    return true;
  };

  const onSubmit = async () => {
    try {
      setIsCreating(true);
      setAlert('');
      const validated = validateQuiz();
      if (!validated) {
        window.scrollTo(0, 0);
        return;
      }
      if (selectedOption === 0) {
        const data = await createQuizUsingAI({ title, description, level: levelOptions[level], topic, numOfQuestions });
        if (data.error) {
          setAlert(data.error);
          return;
        }
        navigate(`/quiz/${data.id}`);
      } else {
        const createQuizData = {
          title,
          description,
          quiz_level: levelOptions[level],
        };
        const data = await createQuiz(createQuizData);

        const createQuestionData = questions.map(
          (question, index) =>
            ({
              question_text: question.text,
              answer_a: question.options[0],
              answer_b: question.options[1],
              answer_c: question.options[2],
              answer_d: question.options[3],
              quiz_order_number: index,
              correct_answer: 'ABCD'[question.correctAnswer],
            }) as IQuestion,
        );

        await addQuestions(createQuestionData, data.id!);
        navigate(`/quiz/${data.id}`);
      }
    } catch (error) {
      console.log(error);
      setAlert('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const QuizSwitch = () => {
    return (
      <div className="switch">
        <div className={selectedOption === 0 ? 'option-selected' : ''} onClick={() => setSelectedOption(0)}>
          <div>Create using AI</div>
        </div>
        <div className={selectedOption === 1 ? 'option-selected' : ''} onClick={() => setSelectedOption(1)}>
          <div>Manual create</div>
        </div>
      </div>
    );
  };

  if (isCreating) return <Loading />;

  return (
    <div className="quiz-container">
      <QuizSwitch />
      <h1>Create a Quiz</h1>
      {alert !== '' && (
        <div className="alert">
          <p>{alert}</p>
        </div>
      )}
      <div className="question-container">
        <ul className="options-list">
          <li className="option-item">
            <label>
              Title
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
          </li>
          <li className="option-item">
            <label>
              Description
              <textarea className="area-styled-higher" value={description} onChange={e => setDescription(e.target.value)} />
            </label>
          </li>
          <li>
            <label>
              Level
              <select
                value={level}
                onChange={e => {
                  setLevel(Number(e.target.value));
                }}
                className="correct-answer-select"
              >
                {levelOptions.map((_level, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    {_level}
                  </option>
                ))}
              </select>
            </label>
          </li>
          {selectedOption === 0 && (
            <>
              <li className="option-item">
                <label>
                  Topic
                  <input type="text" value={topic} onChange={e => setTopic(e.target.value)} />
                </label>
              </li>
              <li className="option-item">
                <label>
                  Number of questions
                  <input type="text" value={numOfQuestions} onChange={e => setNumOfQuestions(Number(e.target.value))} />
                </label>
              </li>
            </>
          )}
        </ul>
      </div>
      {selectedOption === 1 &&
        questions.map((question, index) => (
          <div key={index} className="question-container">
            <div className="question-header">
              <h3>Question {index + 1}</h3>
              <Button type={'secondary'} onClick={() => removeQuestion(index)}>
                Remove
              </Button>
            </div>
            <label className="question-text">
              Question Text:
              <textarea className="area-styled" value={question.text} onChange={e => handleTextChange(index, e.target.value)} />
            </label>

            <ul className="options-list">
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex} className="option-item">
                  <label>
                    Answer {String.fromCharCode(97 + optionIndex).toUpperCase()}:
                    <input type="text" value={option} onChange={e => handleOptionChange(index, optionIndex, e.target.value)} />
                  </label>
                </li>
              ))}
            </ul>

            <label>
              Correct Answer:
              <select
                value={question.correctAnswer}
                onChange={e => handleCorrectAnswerChange(index, parseInt(e.target.value, 10))}
                className="correct-answer-select"
              >
                {question.options.map((_, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    {String.fromCharCode(97 + optionIndex).toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}

      <div className="homepage-start-buttons">
        <Button type="primary" onClick={onSubmit}>
          Create quiz
        </Button>
        {selectedOption === 1 && (
          <Button type={'secondary'} onClick={addQuestion}>
            Add Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
