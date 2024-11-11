import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { User } from '../types/user';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const AUTH_TOKEN_COOKIE = import.meta.env.VITE_AUTH_TOKEN_COOKIE;
const USER_COOKIE = import.meta.env.VITE_USER_COOKIE;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        // when app loads, check for encrypted token and user in cookies
        const encryptedToken = Cookies.get(AUTH_TOKEN_COOKIE);
        const encryptedUser = Cookies.get(USER_COOKIE);

        if (encryptedToken && encryptedUser) {
            try {
                // Decrypt the token and user from the cookies
                const bytesToken = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
                const decryptedToken = bytesToken.toString(CryptoJS.enc.Utf8);
                const bytesUser = CryptoJS.AES.decrypt(encryptedUser, ENCRYPTION_KEY);
                const decryptedUser = JSON.parse(bytesUser.toString(CryptoJS.enc.Utf8));

                if (decryptedToken && decryptedUser) {
                    setToken(decryptedToken);
                    setUser(decryptedUser);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to decrypt token or user:', error);
            }
        }
    }, []);

    // function to log in by saving encrypted token and user in cookies
    const login = (token: string, user: User) => {
        const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), ENCRYPTION_KEY).toString();

        Cookies.set(AUTH_TOKEN_COOKIE, encryptedToken, { expires: 7 }); // cookie expires in 7 days
        Cookies.set(USER_COOKIE, encryptedUser, { expires: 7 });

        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
    };

    // function to log out by removing the token and user cookies
    const logout = () => {
        Cookies.remove(AUTH_TOKEN_COOKIE);
        Cookies.remove(USER_COOKIE);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
       

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
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
