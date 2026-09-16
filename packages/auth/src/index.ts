export interface UserCredentials {
    id: string;
    username: string;
    role: "admin" | "player";
}

const STATIC_USERS = [
    {
        id: "usr_admin_1",
        username: "gamemaster",
        password: "password123",
        role: "admin",
    },
    {
        id: "usr_player_1",
        username: "investigator",
        password: "password123",
        role: "player",
    },
] as const;

export function authenticate(
    username: string,
    password: string,
): UserCredentials | null {
    const match = STATIC_USERS.find(
        (u) =>
            u.username.trim() === username.toLowerCase() &&
            u.password.trim() === password,
    );
    if (!match) return null;
    return { id: match.id, username: match.username, role: match.role };
}
