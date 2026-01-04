import { useAuth } from '../auth/useAuth'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    Users,
    Clock,
    CheckCircle,
    Circle,
    Package2,
    Menu
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { useState } from 'react'

const Sidebar = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    const SidebarLink = ({ to, label, icon: Icon, end = false, onClick }: { to: string, label: string, icon: any, end?: boolean, onClick?: () => void }) => (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive
                        ? "bg-muted text-primary font-medium"
                        : "text-muted-foreground"
                )
            }
        >
            <Icon className="h-4 w-4" />
            {label}
        </NavLink>
    );

    const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
        <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span className="">Project Manager</span>
                </div>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1 pt-2">
                    {user.role === "admin" && (
                        <>
                            <SidebarLink to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} onClick={onLinkClick} />
                            <SidebarLink to="/admin/projects" label="Projects" icon={FolderKanban} onClick={onLinkClick} />
                            <SidebarLink to="/admin/tasks" label="Tasks" icon={ListTodo} onClick={onLinkClick} />
                            <SidebarLink to="/admin/users" label="Users" icon={Users} onClick={onLinkClick} />
                        </>
                    )}
                    {user.role === "user" && (
                        <>
                            <SidebarLink to="/user/dashboard" label="Dashboard" icon={LayoutDashboard} onClick={onLinkClick} />
                            <SidebarLink to="/user/tasks" end={true} label="My Tasks" icon={ListTodo} onClick={onLinkClick} />
                            <SidebarLink to="/user/tasks?status=pending" label="Pending Tasks" icon={Clock} onClick={onLinkClick} />
                            <SidebarLink to="/user/tasks?status=in-progress" label="In Progress" icon={Circle} onClick={onLinkClick} />
                            <SidebarLink to="/user/tasks?status=completed" label="Completed" icon={CheckCircle} onClick={onLinkClick} />
                        </>
                    )}
                </nav>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 bg-background">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-background w-[80%] sm:w-[300px]">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </SheetHeader>
                        <NavContent onLinkClick={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden border-r bg-muted/40 md:block w-[280px] min-h-screen">
                <NavContent />
            </aside>
        </>
    )
}

export default Sidebar
