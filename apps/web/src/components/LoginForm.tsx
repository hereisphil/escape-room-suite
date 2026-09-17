import type { SubmitEventHandler } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginFormProps {
    onLogin: (credentials: LoginCredentials) => void;
    isLoading?: boolean;
    errorMessage?: string;
}

export default function LoginForm({
    onLogin,
    isLoading = false,
    errorMessage,
}: LoginFormProps) {
    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const username = String(formData.get("username") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        onLogin({ username, password });
    };

    return (
        <Card className="w-full max-w-sm my-6">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="mx-auto mb-4">Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6 mb-4">
                        {errorMessage && (
                            <div role="alert" className="form-error">
                                {errorMessage}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
