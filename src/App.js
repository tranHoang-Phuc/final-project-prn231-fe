import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Headers from "./components/Header";
import Authenticate from "./components/Authenticate";
import QuestionCreation from "./pages/QuestionCreation";
import Questions from "./pages/Questions";
import Tags from "./pages/Tags";
import Question from "./pages/Question";
import EditQuestion from "./pages/EditQuestion";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import { DataProvider } from "./components/DataProvider";

function App() {
  return (
    <DataProvider>
      <Router>
        <Headers />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/question/ask" element={<QuestionCreation />} />
          <Route path="/questions/:tagged?/:tagName?" element={<Questions />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/questions/detail/:id" element={<Question />} />
          <Route path="/question/edit/:id" element={<EditQuestion />} />
          <Route path="/profile/:alias?" element={<Profile />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
