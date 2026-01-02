import { getUsers } from "../../api/user.api"
import { useState, useEffect } from "react"

interface User {
    _id: string,
    name: string,
    email: string
}

const AdminUsers = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            const filteredData = data.filter((user: User) => user.role !== "admin");
            setUsers(filteredData);
        } catch (error: unknown) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Loading users...</p>;

    if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminUsers
