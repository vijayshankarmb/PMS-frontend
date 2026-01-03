import { getProjects, createProject, updateProject, deleteProject } from "../../api/project.api";
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
    const [editingProject, setEditingProject] = useState<Project | null>(null);

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
            if (editingProject){
                await updateProject({
                    id: editingProject._id,
                    projectName,
                    projectDescription,
                });
                setEditingProject(null);
            } else {
                await createProject({ projectName, projectDescription });
            }
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

    const handleEdit = async (project: Project)=> {
        setProjectName(project.projectName);
        setProjectDescription(project.projectDescription);
        setEditingProject(project);
    }

    const handleDelete = async (id: string) => {
        try {
            if (confirm("Are you sure? This will delete all tasks in this project.")) {
                setError(null);
                await deleteProject(id);
                fetchProjects();
            }
        } catch (error: unknown) {
            setError(error as string);
        }
    }

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
                    <button type="submit"> {editingProject ? 'Update' : 'Create'} </button>
                </form>
            </div>
            <div>
                <h1>Projects</h1>
                {projects.map((project) => (
                    <div key={project._id}>
                        <h1>{project.projectName}</h1>
                        <p>{project.projectDescription}</p>
                        <button onClick={() => handleDelete(project._id)}>Delete</button>
                        <button onClick={() => handleEdit(project)}>Edit</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AdminProjects
