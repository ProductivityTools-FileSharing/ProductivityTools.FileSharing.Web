import "./App.css";
import Console from "./Components/Console";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { AuthProvider } from "./Session/AuthContext";
import Login from "./Session/Login.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
      <ToastContainer />
    </div>
  );
}

export default App;
