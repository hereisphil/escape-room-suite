// Not a type but useful to have here:
export const SERVER_URL = "http://192.168.1.105:3001";

export interface EscapeRoomType {
    roomId: number;
    shortName: string;
    fullName: string;
    summary: string;
}

export type ClientType = "mobile" | "tablet" | "web" | "test";
