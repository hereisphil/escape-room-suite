import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from "react";
import { io, type Socket } from "socket.io-client";
import type {
    ClientToServerEvents,
    LoginCredentials,
    ServerToClientEvents,
} from "@global-types";
import { SERVER_URL } from "@global-types";

type AuthContextValue = {
    isLoggedIn: boolean;
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    authError: string | null;
    login: (credentials: LoginCredentials) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [socket, setSocket] = useState<Socket<
        ServerToClientEvents,
        ClientToServerEvents
    > | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    const login = ({ username, password }: LoginCredentials) => {
        setAuthError(null);
        socket?.disconnect();

        const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
            io(SERVER_URL, {
                auth: { username, password },
            });

        newSocket.on("connect", () => {
            setIsLoggedIn(true);
            newSocket.emit("client:register", "mobile");
        });

        newSocket.on("connect_error", (err) => {
            setAuthError(err.message);
            newSocket.disconnect();
        });

        setSocket(newSocket);
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, socket, authError, login }}
        >
            {children}
        </AuthContext.Provider>
    );
}
