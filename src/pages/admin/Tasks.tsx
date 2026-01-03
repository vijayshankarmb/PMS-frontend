import React, { useState, useEffect } from "react";
import { createTask, getTasks, updateTaskStatus, deleteTask, updateTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getUsers } from "../../api/user.api";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleEdit = (task: Task) => {
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
    setProjectId(task.projectId._id);
    setAssignedTo(task.assignedTo._id);
    setEditingTask(task);
  }

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

  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        <h1>Create Tasks</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.projectName}
              </option>
            ))}
          </select>

          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={creatingTask}>
            {editingTask ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      <div>
        <h2>Tasks</h2>

        {tasks.length === 0 && <p>No tasks found</p>}

        {tasks.map((task) => {
          const nextStatus = getNextStatus(task.status);

          return (
            <div key={task._id}>
              <p>{task.taskName}</p>
              <p>{task.taskDescription}</p>
              <p>{task.projectId.projectName}</p>
              <p>{task.assignedTo.name}</p>
              <p>{task.status}</p>

              {nextStatus && (
                <button
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
                </button>
              )}

              <button onClick={() => handleDelte(task._id)}>Delete</button>
              <button onClick={() => handleEdit(task)}>Edit</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTasks;
