import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { SERVER_PORT, SERVER_URL } from "@global-types";
import type {
    ClientToServerEvents,
    ClientType,
    LoginCredentials,
    ServerToClientEvents,
} from "@global-types";

function resolveServerUrl(override?: string): string {
    if (override) return override;

    // Browser: use the host that served this page so localhost vs LAN
    // (Wi-Fi vs Ethernet) does not depend on a hardcoded IP.
    if (typeof window !== "undefined") {
        const hostname = window.location?.hostname;
        if (hostname) {
            return `http://${hostname}:${SERVER_PORT}`;
        }
    }

    return SERVER_URL;
}

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
    // Optional. Mobile passes Expo's LAN host so the phone follows
    // whichever interface the Metro bundler is using.
    serverUrl?: string;
    children: ReactNode;
};

export function AuthProvider({
    clientType,
    serverUrl,
    children,
}: AuthProviderProps) {
    const [socket, setSocket] = useState<AppSocket | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    function login({ username, password }: LoginCredentials) {
        setAuthError(null);
        setIsConnecting(true);

        const newSocket: AppSocket = io(resolveServerUrl(serverUrl), {
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
