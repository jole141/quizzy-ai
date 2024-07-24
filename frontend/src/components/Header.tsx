import { FC } from "react";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import Button from "./Button.tsx";

interface IProps {
  showCreateButton?: boolean;
}

export const Header: FC<IProps> = ({ showCreateButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="logo-container" onClick={() => navigate("/")}>
        <img className="app-logo" src={Logo} alt="logo" />
        <p className="app-name">
          Quizzy<strong>AI</strong>
        </p>
      </div>
      <div className="create-button">
        {showCreateButton && (
          <Button type={"primary"} onClick={() => navigate("/create")}>
            Create a Quiz
          </Button>
        )}
      </div>
    </header>
  );
};
