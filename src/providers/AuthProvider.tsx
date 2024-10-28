import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

// Define the structure of the AuthContext
interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// thsiconstants for the cookie name and encryption key
const AUTH_TOKEN_COOKIE = 'authToken';
const ENCRYPTION_KEY = 'hadakhasoikontwilan 7oto fir .env';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // when  app load, check for an encrypted token in the cookie
        const encryptedToken = Cookies.get(AUTH_TOKEN_COOKIE);
        if (encryptedToken) {
            try {
                // here i decrypt token and set authentication state
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

    //  this Function to log in by saving encrypted token in cookies
    const login = (token: string) => {
        const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
        Cookies.set(AUTH_TOKEN_COOKIE, encryptedToken, { expires: 7 }); //  here Cookie expires fi 7 days
        setIsAuthenticated(true);
    };

    // Fthis function to log out by removing the token cookie
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

// Custom hook to access the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
