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
       const fetchData = async() => {
        try{
        const newAccessToken = await refreshToken()
        console.log("New Access Token:", newAccessToken.user);
        if(newAccessToken) {
        const user = newAccessToken.user;

        if (user) {
        loginUser(user);
        }
        }
        } catch(err) {
            console.log(err)
        } finally {
            setIsAuthLoading(false)
        }

       }
       fetchData()
    }, [])

    const loginUser = (auth: Auth): void => {
        setAuth(auth);
        setIsAuthenticated(true);
    };

    
    return (
        <AuthContext.Provider
        value={{ auth, setAuth, loginUser, isAuthenticated, setIsAuthenticated, isAuthLoading, setIsAuthLoading }}
        >
            {children}
            </AuthContext.Provider>
    )
}