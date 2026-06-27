import React, { createContext, useState, useEffect } from 'react';
import useRefreshToken from '../../hooks/useRefresh';
import type { Auth, AuthContextType } from '../../types';


export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [auth, setAuth] = useState<Auth | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthLoading, setIsAuthLoading] = useState(true)
    const refreshToken = useRefreshToken()

    useEffect(() => {
    const fetchData = async () => {
        try {
        const res = await refreshToken();

        if (!res?.user || !res?.access_token) {
            setIsAuthenticated(false);
            setAuth(null);
            return;
        }

        loginUser({
            user: res.user,
            accessToken: res.access_token,
        });

        } catch (err) {
        console.error(err);
        setAuth(null);
        setIsAuthenticated(false);
        } finally {
        setIsAuthLoading(false);
        }
    };

    fetchData();
    }, []);

    const loginUser = (auth: Auth): void => {
        setAuth(auth);
        setIsAuthenticated(true);
    };

    const logoutUser = (): void => {
        setAuth(null);
        setIsAuthenticated(false);
    };

    
    return (
        <AuthContext.Provider
        value={{ auth, setAuth, loginUser, isAuthenticated, setIsAuthenticated, isAuthLoading, setIsAuthLoading, logoutUser }}
        >
            {children}
            </AuthContext.Provider>
    )
}