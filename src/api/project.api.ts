import api from "./axios";
import axios from "axios";

export const getProjects = async () => {
    try {
        const res = await api.get("/projects");
        return res.data.data;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}

export const createProject = async ({projectName, projectDescription}: {projectName: string, projectDescription: string})=> {
    try {
        const res = await api.post("/projects", {projectName, projectDescription});
        return res.data.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}

export const updateProject = async ({id, projectName, projectDescription}: {id: string, projectName: string, projectDescription: string})=> {
    try {
        const res = await api.put(`/projects/${id}`, {projectName, projectDescription});
        return res.data.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}

export const deleteProject = async (id: string)=> {
    try {
        const res = await api.delete(`/projects/${id}`);
        return res.data.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}