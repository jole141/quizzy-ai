import { FC } from "react";
import Logo from "../assets/logo.svg";

export const Loading: FC = () => {
  return (
    <div className="loading">
      <img className="loading-logo" src={Logo} alt="logo" />
    </div>
  );
};
