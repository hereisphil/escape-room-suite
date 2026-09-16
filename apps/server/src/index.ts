import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import type { ClientType, EscapeRoomType } from "@global-types";
import { authenticate, type UserCredentials } from "@global-auth";

const app = express();
const server = createServer(app);

// Enable CORS for all domains (development only)
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

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

// Extend Socket interface to include clientType
declare module "socket.io" {
    interface Socket {
        clientType?: ClientType;
    }
}

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle client type registration with type safety
    socket.on("register-client", (clientType: ClientType) => {
        socket.clientType = clientType;
        connectedClients[clientType]++;
        console.log(
            `${clientType} client connected. Total: ${connectedClients[clientType]}`,
        );
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
