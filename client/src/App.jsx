import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Skills from './pages/Skills';
import StudyPlan from './pages/StudyPlan';
import SkillGap from './pages/SkillGap';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" 
      element={
      <ProtectedRoute>
        <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path="/skills" 
      element={
      <ProtectedRoute>
        <Skills/>
        </ProtectedRoute>
      }/>
      <Route path="/skill-gap" 
      element={
      <ProtectedRoute>
        <SkillGap/>
        </ProtectedRoute>
      }/>
      <Route path='/study-plan' element={<ProtectedRoute><StudyPlan/></ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
