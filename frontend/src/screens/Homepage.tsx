import { FC } from "react";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";

export const Homepage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="homepage-description">
        <h1 className="homepage-title">
          Let's Quiz with <strong>AI</strong>
        </h1>
        <p>
          Welcome to <strong>QuizzyAI</strong> – your go-to platform for
          crafting and exploring quizzes! Dive into a world of personalized quiz
          creation and interactive learning experiences. What sets{" "}
          <strong>QuizzyAI</strong> apart is its revolutionary{" "}
          <strong>AI-assisted feedback system</strong>. After submitting your
          quizzes, our <strong>AI assistant</strong> doesn't just provide
          scores; it meticulously analyzes your responses, pinpointing errors
          and offering detailed insights with explanations for correct answers.
          Join <strong>QuizzyAI</strong> for an educational journey where
          quizzes aren't just assessments – they're opportunities to enhance
          your knowledge and skills. Welcome to a smarter way of learning!
        </p>
        <div className="homepage-start-buttons">
          <Button type={"primary"} onClick={() => navigate("/create")}>
            Create a Quiz
          </Button>
          <Button type={"secondary"} onClick={() => navigate("/quizzes")}>
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
};
