import { FC } from 'react';

interface IQuizLevelProps {
  level: string;
}

export const QuizLevel: FC<IQuizLevelProps> = ({ level }) => {
  const getBackgroundColor = () => {
    if (level === 'Elementary school') return 'rgba(0,194,203,0.5)';
    if (level === 'Middle school') return 'rgba(255,209,102,0.5)';
    if (level === 'University') return 'rgba(239,71,77,0.5)';
  };

  const getTextColor = () => {
    if (level === 'Elementary school') return '#131212';
    if (level === 'Middle school') return '#000000';
    if (level === 'University') return '#FFFFFF';
  };

  return (
    <div
      style={{
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
      }}
      className="level-card"
    >
      {level}
    </div>
  );
};
