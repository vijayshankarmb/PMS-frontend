
import { useAuth } from "../../auth/useAuth";

const UserDashboard = () => {
    const {user} = useAuth();
  return (
    <div>
      <h1>User Dashboard</h1>
      <h1>Welcome {user?.userId}</h1>
      <h1>Welcome {user?.role}</h1>
    </div>
  )
}

export default UserDashboard
