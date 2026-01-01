import { createTask } from "../../api/task.api";
import React, { useState, useEffect } from 'react'

import { getProjects } from "../../api/project.api";
import { getUsers } from "../../api/user.api";

interface Project {
    _id: string,
    projectName: string,
    projectDescription: string,
}

interface User {
    _id: string,
    name: string,
    email: string,
    role: string
}

const AdminTasks = () => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [creatingTask, setCreatingTask] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!projectId || !assignedTo) {
            setError("Please select project and user");
            return;
        }
        try {
            setError(null);
            setCreatingTask(true);
            await createTask({ taskName, taskDescription, projectId, assignedTo });
            setTaskName('');
            setTaskDescription('');
        } catch (error: unknown) {
            setError(error as string);
        } finally {
            setCreatingTask(false);
        }
    }

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error: unknown) {
            setError(error as string);
        }
    }

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            const filteredData = data.filter((user: User) => user.role !== "admin");
            setUsers(filteredData);
        } catch (error: unknown) {
            setError(error as string);
        }
    }

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Create Tasks</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder='Task Name'
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Task Description'
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="projectId">Select project</label>
                    <select
                        name="projectId"
                        id="projectId"
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                    >
                        <option value="">Select project</option>
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>{project.projectName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="assignedTo">Select user</label>
                    <select
                        name="assignedTo"
                        id="assignedTo"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option value="">Select user</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <button type="submit">Submit</button>

            </form>
        </div>
    )
}

export default AdminTasks
