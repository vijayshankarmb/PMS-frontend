import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTasks, updateTaskStatus } from "../../api/task.api";
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRightCircle,
  Projector,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Task {
  _id: string;
  taskName: string;
  taskDescription: string;
  status: "pending" | "in-progress" | "completed";
  projectId: {
    _id: string;
    projectName: string;
  };
}

const UserTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error: unknown) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getNextStatus = (status: Task["status"]) => {
    if (status === "pending") return "in-progress";
    if (status === "in-progress") return "completed";
    return null;
  };

  const filteredTasks = statusFilter
    ? tasks.filter((task) => task.status === statusFilter)
    : tasks;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 mr-1 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 mr-1 text-gray-600" />;
    }
  }

  const getPageTitle = () => {
    if (!statusFilter) return "My Tasks";
    return statusFilter === 'in-progress' ? "Tasks In Progress" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks`;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="font-medium animate-pulse">Loading assigned tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2">
        <Info className="h-5 w-5" />
        <span>Error loading tasks: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h2>
        <p className="text-muted-foreground">
          {statusFilter
            ? `Viewing all ${statusFilter} assignments.`
            : "Manage and track all tasks assigned to you across projects."}
        </p>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 border-2 border-dashed rounded-2xl bg-muted/5">
          <div className="p-5 bg-muted rounded-full group">
            <ClipboardList className="h-10 w-10 text-muted-foreground transition-transform group-hover:scale-110" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">No Tasks Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {statusFilter
                ? `You don't have any tasks marked as ${statusFilter} at the moment.`
                : "You haven't been assigned any tasks yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const nextStatus = getNextStatus(task.status);

            return (
              <Card key={task._id} className="flex flex-col hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/10 hover:border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(task.status)} uppercase tracking-wide`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {task.taskName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <CardDescription className="text-sm line-clamp-3 min-h-[3rem]">
                    {task.taskDescription || "No description provided for this work item."}
                  </CardDescription>
                  <div className="pt-2 border-t flex items-center gap-2 text-sm text-foreground">
                    <div className="p-1.5 bg-muted rounded-md shrink-0">
                      <Projector className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="truncate">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-tighter">Project</span>
                      <span className="font-semibold" title={task.projectId.projectName}>
                        {task.projectId.projectName}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 pb-4 px-6 bg-muted/20 border-t">
                  {nextStatus ? (
                    <Button
                      className="w-full font-bold group"
                      variant="default"
                      onClick={async () => {
                        try {
                          await updateTaskStatus(task._id, nextStatus);
                          fetchTasks();
                        } catch (error: unknown) {
                          setError(error as string);
                        }
                      }}
                    >
                      Advance to {nextStatus}
                      <ArrowRightCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center w-full py-2 text-muted-foreground text-sm font-medium gap-2 italic">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Work Completed
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserTasks;
