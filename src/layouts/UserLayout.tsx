
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Sidebar from '../components/Sidebar';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser } from 'lucide-react'

const UserLayout = () => {

    const { user, logout } = useAuth();

    if (!user) {
        return <Navigate to="/login" />
    }

    if (user.role !== "user") {
        return <Navigate to="/admin/dashboard" />
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row md:bg-background">
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0 w-full">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold md:text-xl">Team Member Portal</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden text-sm font-medium md:block text-muted-foreground mr-2">
                            {user.userId}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default UserLayout
