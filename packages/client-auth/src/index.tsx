import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { SERVER_PORT, SERVER_URL } from "@global-types";
import type {
    ClientToServerEvents,
    ClientType,
    EscapeRoomType,
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

const AUTH_STORAGE_KEY = "escape-room.auth";

// sessionStorage is browser only, undefined on mobile
function canUseSessionStorage(): boolean {
    try {
        return typeof sessionStorage !== "undefined";
    } catch {
        return false;
    }
}

function readStoredCredentials(): LoginCredentials | null {
    if (!canUseSessionStorage()) return null;

    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(raw);
        if (
            parsed &&
            typeof parsed === "object" &&
            "username" in parsed &&
            "password" in parsed &&
            typeof parsed.username === "string" &&
            typeof parsed.password === "string"
        ) {
            return { username: parsed.username, password: parsed.password };
        }
    } catch {
        // Corrupt JSON, drop it.
    }

    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
}

function writeStoredCredentials(credentials: LoginCredentials) {
    if (!canUseSessionStorage()) return;
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials));
}

function clearStoredCredentials() {
    if (!canUseSessionStorage()) return;
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

// Custom socket type every app shares, events are typed the same everywhere
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type AuthValue = {
    socket: AppSocket | null;
    isLoggedIn: boolean;
    isConnecting: boolean;
    authError: string | null;
    rooms: EscapeRoomType[] | null;
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
    const [isConnecting, setIsConnecting] = useState(
        () => readStoredCredentials() !== null,
    );
    const [authError, setAuthError] = useState<string | null>(null);
    const [rooms, setRooms] = useState<EscapeRoomType[] | null>(null);
    const socketRef = useRef<AppSocket | null>(null);

    function login({ username, password }: LoginCredentials) {
        socketRef.current?.disconnect();

        setAuthError(null);
        setIsConnecting(true);
        setRooms(null);

        const credentials: LoginCredentials = { username, password };
        const newSocket: AppSocket = io(resolveServerUrl(serverUrl), {
            auth: credentials,
        });

        let hasConnected = false;

        // Listen before connect. The server emits room:load in its connection
        // handler, which can arrive before any screen's useEffect runs.
        newSocket.on("room:load", (loadedRooms) => {
            setRooms(loadedRooms);
        });

        newSocket.on("connect", () => {
            hasConnected = true;
            writeStoredCredentials(credentials);
            setIsConnecting(false);
            setIsLoggedIn(true);
            newSocket.emit("client:register", clientType);
        });

        newSocket.on("connect_error", (error) => {
            if (hasConnected) return;

            setIsConnecting(false);
            setIsLoggedIn(false);
            setAuthError(error.message);
            setRooms(null);
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);

            if (error.message.includes("Unauthorized")) {
                clearStoredCredentials();
            }
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
    }

    const loginRef = useRef(login);
    loginRef.current = login;

    function logout() {
        socketRef.current?.disconnect();
        socketRef.current = null;
        clearStoredCredentials();
        setSocket(null);
        setIsLoggedIn(false);
        setIsConnecting(false);
        setAuthError(null);
        setRooms(null);
    }

    useEffect(() => {
        const saved = readStoredCredentials();
        if (saved) loginRef.current(saved);

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                socket,
                isLoggedIn,
                isConnecting,
                authError,
                rooms,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
