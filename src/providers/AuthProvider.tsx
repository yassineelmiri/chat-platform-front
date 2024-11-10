import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY
const AUTH_TOKEN_COOKIE = import.meta.env.VITE_AUTH_TOKEN_COOKIE

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // when app loads, check for an encrypted token in the cookie
        const encryptedToken = Cookies.get(AUTH_TOKEN_COOKIE);
        if (encryptedToken) {
            try {
                // decrypt token and set authentication state
                const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
                const token = bytes.toString(CryptoJS.enc.Utf8);
                if (token) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to decrypt token:', error);
            }
        }
    }, []);

    // function to log in by saving encrypted token in cookies
    const login = (token: string) => {
        const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
        Cookies.set(AUTH_TOKEN_COOKIE, encryptedToken, { expires: 7 }); // cookie expires in 7 days
        setIsAuthenticated(true);
    };

    // function to log out by removing the token cookie
    const logout = () => {
        Cookies.remove(AUTH_TOKEN_COOKIE);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// hee is custom hook to access the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};