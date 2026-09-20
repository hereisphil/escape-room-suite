import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { SERVER_URL } from "@global-types";
import type {
    ClientToServerEvents,
    ClientType,
    LoginCredentials,
    ServerToClientEvents,
} from "@global-types";

// Custom socket type every app shares, events are typed the same everywhere
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type AuthValue = {
    socket: AppSocket | null;
    isLoggedIn: boolean;
    isConnecting: boolean;
    authError: string | null;
    login: (credentials: LoginCredentials) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used inside an <AuthProvider>");
    }
    return value;
}

type AuthProviderProps = {
    // Each app says its type: "web", "mobile", or "tablet".
    clientType: ClientType;
    children: ReactNode;
};

export function AuthProvider({ clientType, children }: AuthProviderProps) {
    const [socket, setSocket] = useState<AppSocket | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    function login({ username, password }: LoginCredentials) {
        setAuthError(null);
        setIsConnecting(true);

        const newSocket: AppSocket = io(SERVER_URL, {
            auth: { username, password },
        });

        newSocket.on("connect", () => {
            setIsConnecting(false);
            setIsLoggedIn(true);
            newSocket.emit("client:register", clientType);
        });

        newSocket.on("connect_error", (error) => {
            setIsConnecting(false);
            setIsLoggedIn(false);
            setAuthError(error.message);
            newSocket.disconnect();
            setSocket(null);
        });

        setSocket(newSocket);
    }

    function logout() {
        if (socket) socket.disconnect();
        setSocket(null);
        setIsLoggedIn(false);
        setIsConnecting(false);
        setAuthError(null);
    }

    return (
        <AuthContext.Provider
            value={{
                socket,
                isLoggedIn,
                isConnecting,
                authError,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
