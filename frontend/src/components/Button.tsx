import React, { FC, MouseEvent } from "react";

interface ButtonProps {
  type: "primary" | "secondary";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({ type, onClick, children }) => {
  const buttonClass =
    type === "primary" ? "primary-button" : "secondary-button";

  return (
    <button className={`button ${buttonClass}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
