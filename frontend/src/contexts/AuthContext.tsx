import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    fullName?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    setAuthState: (data: { isAuthenticated: boolean; user: User | null }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    const user = JSON.parse(userData) as User;
                    setIsAuthenticated(true);
                    setUser(user);
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const setAuthState = (data: { isAuthenticated: boolean; user: User | null }) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        if (data.isAuthenticated && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    if (loading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}