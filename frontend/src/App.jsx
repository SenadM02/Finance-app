import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from './components/Registration.jsx'
import Login from './components/Login.jsx'
import Homepage from './components/Homepage.jsx'
import { ROUTES } from "./routes.jsx";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={localStorage.getItem("authToken") ? (<Navigate to={ROUTES.HOME} replace />)
        : (<Navigate to={ROUTES.LOGIN} replace />)} />
        <Route path={ROUTES.HOME} element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
        <Route path={ROUTES.REGISTER} element={<PublicRoute><Register /></PublicRoute>} />
      </Routes>
    </>
  )
}

export default App
