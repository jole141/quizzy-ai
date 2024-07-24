import React, { FC } from 'react';
import { getQuizzes, IQuiz } from '../../api/quizApi.tsx';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components/Loading.tsx';
import { QuizLevel } from '../components/QuizLevel.tsx';

export const Explore: FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = React.useState<IQuiz[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const formatDescription = (description: string) => {
    if (description.length > 120) {
      return description.slice(0, 120) + '...';
    }
    return description;
  };

  const handleQuizSelection = (id: number) => {
    navigate(`/quiz/${id}`);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="quiz-list">
      {quizzes.map((quiz, index) => (
        <div className="quiz-info-container" key={index} onClick={() => handleQuizSelection(quiz.id!)}>
          <h3>{quiz.title}</h3>
          <QuizLevel level={quiz.quiz_level!} />
          <p>{formatDescription(quiz.description)}</p>
        </div>
      ))}
    </div>
  );
};
