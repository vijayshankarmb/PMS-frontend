import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTasks, updateTaskStatus } from "../../api/task.api";

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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Tasks</h1>

      {filteredTasks.length === 0 && (
        <p>No tasks found</p>
      )}

      {filteredTasks.map((task) => {
        const nextStatus = getNextStatus(task.status);

        return (
          <div
            key={task._id}
          >
            <h3>{task.taskName}</h3>
            <p>{task.taskDescription}</p>
            <p>
              <strong>Project:</strong> {task.projectId.projectName}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>

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
          </div>
        );
      })}
    </div>
  );
};

export default UserTasks;
