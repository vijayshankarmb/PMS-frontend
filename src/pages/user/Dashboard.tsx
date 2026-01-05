import { useAuth } from "../../auth/useAuth"
import { LayoutDashboard, UserCircle, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const UserDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-2 text-primary">
        <LayoutDashboard className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Dashboard</h1>
      </div>

      <Card className="max-w-2xl border-l-4 border-l-primary shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            Welcome, {user?.userId}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-tight">Your Role :</span>
              <span className="text-lg font-bold text-primary capitalize">{user?.role}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDashboard
