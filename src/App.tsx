
import { useAuth } from './auth/useAuth'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  const { user, loading } = useAuth();
  console.log("Auth state", user, loading);
  if (loading) return <h1>Loading...</h1>;
  return (
    <Routes>
      <Route path='/login'
      element={user ? <Navigate to="/Dashboard" /> : <Login/>} />

      <Route path='/signup' element={user ? <Navigate to="/dashboard" /> : <Signup/>} />

      <Route  path='/dashboard' element={user ? <Dashboard/> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  )
}

export default App
