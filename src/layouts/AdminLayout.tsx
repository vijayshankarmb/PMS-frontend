
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {

    const {user, logout} = useAuth();

    if (!user) {
        return <Navigate to="/login" />
    }

    if (user.role !== "admin"){
        return <Navigate to="/user/dashboard" />
    }

  return (
    <div style={{display: "flex"}}>
        <Sidebar />
        <div style={{flex: 1}}>
        <header>
            <h1>Admin pannel</h1>
            <p>User : {user.userId}</p>
            <button onClick={logout}>logout</button>
        </header>
        <main>
            <Outlet />
        </main>
        </div>
    </div>
  )
}

export default AdminLayout
