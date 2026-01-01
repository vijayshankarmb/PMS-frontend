
import { useAuth } from './auth/useAuth'
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';

import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';

import AdminProjects from './pages/admin/Projects';
import AdminUsers from './pages/admin/Users';
import AdminTasks from './pages/admin/Tasks';

const App = () => {
  const { user, loading } = useAuth();
  console.log("Auth state", user, loading);
  if (loading) return <h1>Loading...</h1>;
  return (
    <Routes>
      <Route path='/login'
        element={user
          ? user.role === "admin"
            ? <Navigate to="/admin/dashboard" />
            : <Navigate to="/user/dashboard" />
          : <Login />} />

      <Route path='/signup' element={user
        ? user.role === "admin"
          ? <Navigate to="/admin/dashboard" />
          : <Navigate to="/user/dashboard" />
        : <Signup />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tasks" element={<AdminTasks />} />
      </Route>

      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  )
}

export default App
