import api from "./axios";
import axios from "axios";

export const createTask = async ({taskName, taskDescription, projectId, assignedTo}: {taskName: string, taskDescription: string, projectId: string, assignedTo: string})=> {
    try {
        const res = await api.post("/tasks", {taskName, taskDescription, projectId, assignedTo});
        return res.data.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}

export const getTasks = async () => {
    try {
        const res = await api.get("/tasks");
        return res.data.data;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}

export const updateTaskStatus = async (id: string, status: string) => {
    try {
        const res = await api.put(`/tasks/status/${id}`, {status});
        return res.data.data;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}