import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import type {
    ClientType,
    EscapeRoomType,
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData,
} from "@global-types";
import { authenticate } from "@global-auth";

const EscapeRooms: EscapeRoomType[] = [
    {
        id: 1,
        slug: "Deep-Sea",
        name: "Deep-Sea Abyssal Research Station",
        summary:
            "A catastrophic pressure hull breach where players calibrate depth gauges, restore ballast integrity, and decode bioluminescent sonar signals to surface before oxygen depletion.",
    },
    {
        id: 2,
        slug: "Bunker",
        name: "Decommissioned Cold War Bunker",
        summary:
            "An analog-to-digital missile silo lockdown where players patch rotary dial circuitry, cross-reference encrypted punch cards, and cycle manual radiation blast doors.",
    },
    {
        id: 3,
        slug: "Clockwork",
        name: "Abandoned Clockwork Archive",
        summary:
            "The mechanical subterranean vault of a vanished horologist, requiring players to synchronize massive brass pendulum gears, align astrolabe lenses, and wind counterweighted escapement locks.",
    },
];

const app = express();
const server = createServer(app);

// Enable CORS for all domains (development only)
app.use(cors());

const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
    server,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        connectionStateRecovery: {
            skipMiddlewares: true,
        },
    },
);

// Track connected clients by type with proper typing
interface ConnectedClients {
    [key: string]: number;
}
const connectedClients: ConnectedClients = {
    mobile: 0,
    tablet: 0,
    web: 0,
    test: 0,
};

/* -------------------------------------------------------------------------- */
/*                           Middleware: Auth Guard                           */
/* -------------------------------------------------------------------------- */
// io.use((socket, next) => {
//     const { username, password } = socket.handshake.auth;
//     const user = authenticate(username, password);
//     if (!user) {
//         console.log("Unauthorized attempted connection.");
//         next(new Error("Unauthorized: Invalid credentials"));
//     }
//     // Store user info directly on the socket instance
//     socket.data.user = user;
//     next();
// });

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.emit("room:load", EscapeRooms);

    socket.on("client:register", (clientType) => {
        socket.data.clientType = clientType;
        connectedClients[clientType]++;
        console.log(
            `${clientType} client connected. Total: ${connectedClients[clientType]}`,
        );
    });

    socket.on("message:send", (message) => {
        console.log(message);
        socket.emit("message:received", message);
    });

    socket.on("admin:error", (error) => {
        console.log(error);
    });
});

server.listen(3001, () => {
    console.log(`Server running at http://localhost:3001`);
    console.log("Waiting for clients to connect...");
});

// Basic health/status route
app.get("/", (_req, res) => {
    res.json({
        status: "online",
        service: "Escape Room Suite Server",
        uptime: process.uptime(),
        clients: connectedClients,
    });
});
