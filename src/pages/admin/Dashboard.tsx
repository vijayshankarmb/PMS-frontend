
import { useAuth } from "../../auth/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              Here's an overview of your current session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">User ID</span>
                <span className="text-xl font-bold">{user?.userId}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Role</span>
                <span className="text-xl font-bold capitalize">{user?.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
