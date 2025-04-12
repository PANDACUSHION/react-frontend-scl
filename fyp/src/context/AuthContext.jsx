// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        try {
            return token ? jwtDecode(token) : null;  // jwtDecode already returns payload
        } catch (error) {
            console.error('Invalid token in localStorage:', error);
            localStorage.removeItem('token');
            return null;
        }
    });

    const login = (userData) => {
        const { token } = userData;
        if (!token) {
            throw new Error('No token provided during login');
        }

        try {
            const decodedUser = jwtDecode(token); // Extract payload
            localStorage.setItem('token', token);
            setUser(decodedUser);
        } catch (error) {
            console.error('Failed to decode token:', error);
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};