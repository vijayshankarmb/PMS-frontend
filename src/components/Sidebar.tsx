
import { useAuth } from '../auth/useAuth'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const {user} = useAuth();

    if (!user) return null;

  return (
    <aside>
        {
            user.role === "admin" && (
                <ul>
                    <li> <Link to="/admin/dashboard"> Dashboard </Link> </li>
                    <li> <Link to="/admin/projects"> Projects </Link> </li>
                    <li> <Link to="/admin/tasks"> Tasks </Link> </li>
                    <li> <Link to="/admin/users"> Users </Link> </li>
                </ul>
            )
        }
        {
            user.role === "user" && (
                <ul>
                    <li> <Link to="/user/dashboard"> Dashboard </Link> </li>
                    <li> <Link to="/user/task?status=pending"> Pending </Link> </li>
                    <li> <Link to="/user/task?status=in-progress"> In-Progress </Link> </li>
                    <li> <Link to="/user/task?status=completed"> Completed </Link> </li>
                </ul>
            )
        }
    </aside>
  )
}

export default Sidebar
