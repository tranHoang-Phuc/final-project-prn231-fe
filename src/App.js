import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Headers from './components/Header';
import Authenticate from './components/Authenticate'
import QuestionCreation from './pages/QuestionCreation';
import Questions from './pages/Questions';
import Tags from './pages/Tags';
import Question from './pages/Question';

function App() {
  return (
    <Router>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path='/question/ask' element={<QuestionCreation />} />
        <Route path='/questions/:tagged?/:tagName?' element={<Questions/>} />
        <Route path='/tags' element={<Tags/>} />
        <Route path='/questions/detail/:id' element={<Question/>} />
      </Routes>
    </Router>
  );
}

export default App;
