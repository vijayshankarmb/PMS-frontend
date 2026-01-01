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