
import { useAuth } from '../auth/useAuth'

const Dashboard = () => {
    const {user, logout} = useAuth();
  return (
    <div>
      <h1>Welcome {user?.userId}</h1>
      <h1>Welcome {user?.role}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Dashboard
