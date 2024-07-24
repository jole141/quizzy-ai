import { FC } from 'react';

interface ScoreLineProps {
  score: number;
}

const ScoreLine: FC<ScoreLineProps> = ({ score }) => {
  const calculateWidth = () => {
    return `${score * 100}%`;
  };

  return (
    <div className="score-line">
      <div className="variable-rectangle" style={{ width: calculateWidth() }}></div>
      <p className={'display-score'}>{calculateWidth()}</p>
    </div>
  );
};

export default ScoreLine;
