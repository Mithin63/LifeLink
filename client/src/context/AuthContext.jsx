import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('bloodconnect_token'));
    const [isLoading, setIsLoading] = useState(true);
    const refreshUser = async () => {
        const currentToken = localStorage.getItem('bloodconnect_token');
        if (!currentToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const res = await api.getMe();
            if (res.success && res.user) {
                setUser(res.user);
            }
            else {
                logout();
            }
        }
        catch (err) {
            console.warn('Session expired or server unavailable:', err);
            // Fallback demo user if server restart happened while browsing
            const cachedRole = localStorage.getItem('bloodconnect_demo_role') || 'patient';
            setUser({
                id: 2,
                name: 'Mithin Patient',
                email: 'patient@bloodconnect.org',
                phone: '+91 9876543211',
                role: cachedRole
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        refreshUser();
    }, []);
    const login = async (credentials) => {
        setIsLoading(true);
        try {
            const res = await api.login(credentials);
            if (res.success && res.token) {
                localStorage.setItem('bloodconnect_token', res.token);
                localStorage.setItem('bloodconnect_demo_role', res.user.role);
                setToken(res.token);
                setUser(res.user);
                return res.user;
            }
            throw new Error(res.message || 'Login failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const register = async (userData) => {
        setIsLoading(true);
        try {
            const res = await api.register(userData);
            if (res.success && res.token) {
                localStorage.setItem('bloodconnect_token', res.token);
                localStorage.setItem('bloodconnect_demo_role', res.user.role);
                setToken(res.token);
                setUser(res.user);
                return res.user;
            }
            throw new Error(res.message || 'Registration failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('bloodconnect_token');
        localStorage.removeItem('bloodconnect_demo_role');
        setToken(null);
        setUser(null);
        try {
            api.logout();
        }
        catch {
            // ignore
        }
    };
    const switchRoleForDemo = async (role) => {
        const roleAccounts = {
            admin: { email: 'admin@bloodconnect.org', pass: 'admin123' },
            patient: { email: 'patient@bloodconnect.org', pass: 'patient123' },
            donor: { email: 'donor@bloodconnect.org', pass: 'donor123' },
            hospital: { email: 'hospital@bloodconnect.org', pass: 'hospital123' },
            blood_bank: { email: 'bank@bloodconnect.org', pass: 'password123' }
        };
        const creds = roleAccounts[role] || roleAccounts.patient;
        await login({ emailOrPhone: creds.email, password: creds.pass });
    };
    return (<AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
            refreshUser,
            switchRoleForDemo
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
