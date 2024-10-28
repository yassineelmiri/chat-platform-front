import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';


// here i create  structure of the AuthContext
interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}
// AuthProvider component that manages authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

//  this iskey for storing authentication token in localStorage
const AUTH_TOKEN_KEY = 'authToken';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // when app run this code check localstorage if store user if ye save it to global user 
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);


    // call function after user  get succfully login from backend
    const login = (token: string) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        setIsAuthenticated(true);
    };


    // call this when want user logout 
    const logout = () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
