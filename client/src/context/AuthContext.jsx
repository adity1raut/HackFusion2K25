// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AuthService from "../utils/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
    const [user, setUser] = useState(AuthService.getUserDetails());

    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(AuthService.isAuthenticated());
            setUser(AuthService.getUserDetails());
        };

        window.addEventListener("authChange", handleAuthChange);
        return () => window.removeEventListener("authChange", handleAuthChange);
    }, []);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            setIsAuthenticated,
            user,
            setUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};