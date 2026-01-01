import { getProjects, createProject } from "../../api/project.api";
import { useState, useEffect } from "react";

interface Project {
    _id: string,
    projectName: string,
    projectDescription: string,
}

const AdminProjects = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [creatingProject, setCreatingProject] = useState(false);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error: unknown) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setError(null);
            setCreatingProject(true);
            await createProject({ projectName, projectDescription });
            fetchProjects();
            setProjectName('');
            setProjectDescription('');
        } catch (error: unknown) {
            setError(error as string);
        } finally {
            setCreatingProject(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, [])

    if (loading) {
        return <p>Loading projects...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    if (projects.length === 0) {
        return <p>No projects found</p>
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>Create New Project</h1>
                    <input
                        type="text"
                        placeholder="Enter Title"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)} />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div>
                <h1>Projects</h1>
                {projects.map((project) => (
                    <div key={project._id}>
                        <h1>{project.projectName}</h1>
                        <p>{project.projectDescription}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AdminProjects
