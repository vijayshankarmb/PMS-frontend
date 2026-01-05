import React, { useState, useEffect } from "react";
import { createTask, getTasks, updateTaskStatus, deleteTask, updateTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getUsers } from "../../api/user.api";
import { Plus, Pencil, Trash2, ClipboardList, CheckCircle2, Circle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Project {
  _id: string;
  projectName: string;
  projectDescription: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  _id: string;
  taskName: string;
  taskDescription: string;
  status: string;
  projectId: {
    _id: string;
    projectName: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
}

const AdminTasks = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [creatingTask, setCreatingTask] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error: unknown) {
      setError(error as string);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.filter((u: User) => u.role !== "admin"));
    } catch (error: unknown) {
      setError(error as string);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error: unknown) {
      setError(error as string);
    }
  };

  const startCreate = () => {
    setTaskName("");
    setTaskDescription("");
    setProjectId("");
    setAssignedTo("");
    setEditingTask(null);
    setIsDialogOpen(true);
  }

  const startEdit = (task: Task) => {
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
    setProjectId(task.projectId._id);
    setAssignedTo(task.assignedTo._id);
    setEditingTask(task);
    setIsDialogOpen(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !assignedTo) {
      setError("Please select project and user");
      return;
    }

    try {
      setError(null);
      setCreatingTask(true);
      if (editingTask) {
        await updateTask({
          id: editingTask._id,
          taskName,
          taskDescription,
          projectId,
          assignedTo,
        });
      } else {
        await createTask({ taskName, taskDescription, projectId, assignedTo });
      }
      setIsDialogOpen(false);
      await fetchTasks();
      setTaskName("");
      setTaskDescription("");
      setProjectId("");
      setAssignedTo("");
    } catch (error: unknown) {
      setError(error as string);
    } finally {
      setCreatingTask(false);
    }
  };

  const getNextStatus = (status: string) => {
    if (status === "pending") return "in-progress";
    if (status === "in-progress") return "completed";
    return null;
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchTasks();
  }, []);

  const handleDelte = async (id: string) => {
    try {
      if (confirm("Are you sure? This will delete this task.")) {
        setError(null);
        await deleteTask(id);
        await fetchTasks();
      }
    } catch (error: unknown) {
      setError(error as string);
    }
  }

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
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return <Circle className="h-4 w-4 mr-1" />;
    }
  }


  if (error) return <div className="text-destructive p-4">Error: {error}</div>;

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage and assign tasks to team members.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={startCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
              <DialogDescription>
                {editingTask ? 'Update task details and assignment.' : 'Create a new task and assign it to a team member.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="taskName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="taskName"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="taskDescription" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="taskDescription"
                    placeholder="Task Description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project" className="text-right">
                    Project
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="project"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="" disabled>Select project</option>
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignedTo" className="text-right">
                    Assign To
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="assignedTo"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="" disabled>Select user</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creatingTask}>
                  {creatingTask ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <ClipboardList className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">No Tasks Yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Create tasks to track work items and assign them to your team members.
            </p>
          </div>
          <Button onClick={startCreate} variant="outline">
            Create Your First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const nextStatus = getNextStatus(task.status);
            return (
              <Card key={task._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-medium leading-none truncate" title={task.taskName}>
                      {task.taskName}
                    </CardTitle>
                    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)} capitalize`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </div>

                  </div>
                  <CardDescription className="line-clamp-2 mt-2 min-h-[2.5rem]">
                    {task.taskDescription || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <span className="font-medium mr-2 text-foreground">Project:</span> {task.projectId?.projectName || 'Unknown Project'}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <span className="font-medium mr-2 text-foreground">Assigned:</span> {task.assignedTo?.name || 'Unassigned'}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-4 border-t bg-muted/20">
                  {nextStatus && (
                    <Button
                      className="w-full"
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        try {
                          await updateTaskStatus(task._id, nextStatus);
                          fetchTasks();
                        } catch (error: unknown) {
                          setError(error as string);
                        }
                      }}
                    >
                      Mark as {nextStatus}
                    </Button>
                  )}
                  <div className="flex justify-end gap-2 w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => startEdit(task)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-1"
                      onClick={() => handleDelte(task._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
