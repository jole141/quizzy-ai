import "./App.css";
import { Header } from "./components/Header.tsx";
import { Homepage } from "./screens/Homepage.tsx";
import { Routes, Route } from "react-router-dom";
import { Quiz } from "./components/Quiz.tsx";
import { Explore } from "./screens/Explore.tsx";
import { QuizDetails } from "./screens/QuizDetails.tsx";

const HomepageScreen = () => {
  return (
    <>
      <Header />
      <Homepage />
    </>
  );
};

const QuizScreen = () => {
  return (
    <>
      <Header showCreateButton />
      <Explore />
    </>
  );
};

const CreateQuizScreen = () => {
  return (
    <>
      <Header />
      <Quiz />
    </>
  );
};

const QuizDetailScreen = () => {
  return (
    <>
      <Header showCreateButton />
      <QuizDetails />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomepageScreen />} />
      <Route path="/quizzes" element={<QuizScreen />} />
      <Route path="/create" element={<CreateQuizScreen />} />
      <Route path="/quiz/:id" element={<QuizDetailScreen />} />
    </Routes>
  );
}

export default App;
