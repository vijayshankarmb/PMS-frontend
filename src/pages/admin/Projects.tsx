import { getProjects, createProject, updateProject, deleteProject } from "../../api/project.api";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const startCreate = () => {
        setProjectName('');
        setProjectDescription('');
        setEditingProject(null);
        setIsDialogOpen(true);
    }

    const startEdit = (project: Project) => {
        setProjectName(project.projectName);
        setProjectDescription(project.projectDescription);
        setEditingProject(project);
        setIsDialogOpen(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            setCreatingProject(true);
            if (editingProject) {
                await updateProject({
                    id: editingProject._id,
                    projectName,
                    projectDescription,
                });
                setEditingProject(null);
            } else {
                await createProject({ projectName, projectDescription });
            }
            setIsDialogOpen(false);
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
        return <div className="flex justify-center items-center h-full text-muted-foreground">Loading projects...</div>
    }

    if (error) {
        return <div className="text-destructive p-4">Error: {error}</div>
    }

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">Manage your organization's projects.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={startCreate} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Create Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                            <DialogDescription>
                                {editingProject ? 'Update the details of your project.' : 'Add a new project to your workspace.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Project Title"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Project Description"
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={creatingProject}>
                                    {creatingProject ? 'Saving...' : (editingProject ? 'Save Changes' : 'Create Project')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                        <FolderKanban className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">No Projects Yet</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Get started by creating your first project to manage tasks and track progress.
                        </p>
                    </div>
                    <Button onClick={startCreate} variant="outline">
                        Create Your First Project
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project._id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl truncate" title={project.projectName}>
                                    {project.projectName}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                    {project.projectDescription || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                {/* Use this space for future stats or details */}
                                <div className="text-sm text-muted-foreground">
                                    {/* Placeholder for task count or status */}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEdit(project)}
                                >
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(project._id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminProjects
