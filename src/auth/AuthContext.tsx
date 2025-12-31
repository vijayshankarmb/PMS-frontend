import { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import type { ReactNode } from "react";
import axios from "axios";

interface User {
    userId: string,
    role: "admin" | "user",
}

interface AuthContextType {
    user: User | null,
    loading: boolean,
    signup: (name: string, email: string, password: string) => Promise<void>,
    login: (email: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMe();
    }, []);

    const signup = async (name: string, email: string, password: string) => {
        try {
            const res = await api.post("/auth/signup", { name, email, password });
             console.log(res);
            await login(email, password);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data?.message || "Request failed";
            }
            throw "Something went wrong";
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            console.log(res);
            await fetchMe();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data?.message || "Request failed";
            }
            throw "Something went wrong";
        }
    }

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext };