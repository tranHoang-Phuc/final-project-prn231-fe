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
import EditAnswer from "./pages/EditAnswer";
import { DataProvider } from "./components/DataProvider";
import Protected from "./components/Protected";

function App() {
  return (
    <DataProvider>
      <Router>
        <Headers />
        <Routes>
          {/* Các route không cần bảo vệ */}
          <Route path="/login" element={<Login />} />
          <Route path="/authenticate" element={<Authenticate />} />

          {/* Các route cần bảo vệ */}
          <Route
            path="/*"
            element={
              <Protected>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/question/ask" element={<QuestionCreation />} />
                  <Route path="/questions/:tagged?/:tagName?" element={<Questions />} />
                  <Route path="/tags" element={<Tags />} />
                  <Route path="/questions/detail/:id" element={<Question />} />
                  <Route path="/question/edit/:id" element={<EditQuestion />} />
                  <Route path="/profile/:alias?" element={<Profile />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/questions/:questionId/answers/:id?/edit" element={<EditAnswer />} />
                </Routes>
              </Protected>
            }
          />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
