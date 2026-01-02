import { getTasks } from "../../api/task.api";
import { useState, useEffect } from "react";

interface Task {
    _id: string;
    taskName: string;
    taskDescription: string;
    status: string;
    projectId: {
        _id: string;
        projectName: string;
    };
}

const UserInProgressTasks = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            const filteredData = data.filter((task: Task) => task.status === "in-progress");
            setTasks(filteredData);
        } catch (error: unknown) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    },[])

    if (loading) return <p>Loading tasks...</p>;

    if (error) return <p>{error}</p>;

    if (tasks.length === 0) return <p>No tasks in In-Progress</p>;

  return (
    <div>
      <h1>In-Progress Tasks</h1>
      {
        tasks.map((task) => (
            <div key={task._id}>
                <h2>{task.taskName}</h2>
                <p>{task.taskDescription}</p>
                <p>{task.status}</p>
                <p>{task.projectId.projectName}</p>
            </div>
        ))
      }
    </div>
  )
}

export default UserInProgressTasks