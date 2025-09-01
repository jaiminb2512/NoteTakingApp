import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
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

    const setAuthState = (data: { isAuthenticated: boolean; user: User | null }) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
    };

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