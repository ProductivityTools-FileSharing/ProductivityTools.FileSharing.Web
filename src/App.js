import "./App.css";
import Console from './Components/Console'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { AuthProvider } from "./Session/AuthContext";
import Login from './Session/Login.js'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Console />} />
            <Route path="/Login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
