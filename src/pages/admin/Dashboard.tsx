
import { useAuth } from "../../auth/useAuth";

const AdminDashboard = () => {
    const {user} = useAuth();
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h1>Welcome {user?.userId}</h1>
      <h1>Welcome {user?.role}</h1>
    </div>
  )
}

export default AdminDashboard
