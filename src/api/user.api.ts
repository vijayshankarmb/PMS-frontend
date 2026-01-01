import api from "./axios";
import axios from "axios";

export const getUsers = async () => {
    try {
        const res = await api.get("/users");
        return res.data.data;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            throw error.response?.data?.message || "Request failed";
        }
        throw "Something went wrong";
    }
}