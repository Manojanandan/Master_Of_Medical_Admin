// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => sessionStorage.getItem("jwt") || null);

    useEffect(() => {
        const jwt = sessionStorage.getItem("jwt");
        if (jwt) setToken(jwt);
    }, []);

    const login = (token) => {
        sessionStorage.setItem("jwt", token);
        setToken(token);
    };

    const logout = () => {
        sessionStorage.removeItem("jwt");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
