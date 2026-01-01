
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Sidebar from '../components/Sidebar';

const UserLayout = () => {

    const {user, logout} = useAuth();

    if (!user) {
        return <Navigate to="/login" />
    }

    if (user.role !== "user"){
        return <Navigate to="/admin/dashboard" />
    }

  return (
    <div style={{display: "flex"}}>
        <Sidebar />
        <div style={{flex: 1}}>
        <header>
            <h1>User pannel</h1>
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

export default UserLayout
