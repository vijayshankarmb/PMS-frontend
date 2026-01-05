import { getUsers } from "../../api/user.api"
import { useState, useEffect } from "react"
import { Users, Mail, UserCircle, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  _id: string,
  name: string,
  email: string,
  role?: string
}

const AdminUsers = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      // Filter out admins if present, assuming 'role' exists based on previous task context
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

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh] text-muted-foreground animate-pulse">Loading team members...</div>;
  }

  if (error) {
    return <div className="text-destructive p-4 border border-destructive/20 bg-destructive/10 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
        <p className="text-muted-foreground">Manage and view all users in your organization.</p>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">No Team Members Found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              There are currently no users registered in the system aside from administrators.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <Card key={user._id} className="overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-2 bg-primary/10 group-hover:bg-primary/30 transition-colors" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg truncate font-bold" title={user.name}>
                    {user.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate" title={user.email}>{user.email}</span>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Team Member
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
