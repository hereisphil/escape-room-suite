// Not a type but useful to have here:
export const SERVER_URL = "http://192.168.1.105:3001";

export interface EscapeRoomType {
    id: number;
    slug: string;
    name: string;
    summary: string;
}

export type ClientType = "mobile" | "tablet" | "web" | "test";

/* -------------------------------------------------------------------------- */
/*                              Socket.io Events                              */
/* -------------------------------------------------------------------------- */

// Events emitted by the Server and handled by the Client
export interface ServerToClientEvents {
    "room:load": (rooms: EscapeRoomType[]) => void;
    "message:received": (message: string) => void;
}

// Events emitted by the Client and handled by the Server
export interface ClientToServerEvents {
    "client:register": (clientType: ClientType) => void;
    "message:send": (message: string) => void;
    "admin:error": (error: string) => void;
}

// Custom properties stored in socket.data
interface User {
    id: string;
    username: string;
    role: "admin" | "player";
}
export interface SocketData {
    user: User;
    clientType: ClientType;
}
