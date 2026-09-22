import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { EscapeRoomType } from "@global-types/src";
import { useState } from "react";
import type { Socket } from "socket.io-client";

export function StartCountdown({
    roomId,
    roomName,
    socket,
}: {
    roomId: EscapeRoomType["id"];
    roomName: EscapeRoomType["name"];
    socket: Socket;
}) {
    const [open, setOpen] = useState(false);

    const successToast = () => {
        toast.add({
            type: "success",
            description: `Let the games begin in room: ${roomName}`,
        });
    };

    const errorToast = () => {
        toast.add({
            type: "error",
            description: "Error starting countdown. Try again.",
        });
    };

    const handleCLick = () => {
        try {
            socket.emit("room:start", roomId);
            successToast();
            setOpen(false);
        } catch (error) {
            socket.emit("admin:error", error);
            errorToast();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={<Button type="button">Start Countdown</Button>}
            />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Start the countdown?</DialogTitle>
                    <DialogDescription>
                        You're about to start the countdown for Room:{" "}
                        {<strong>{`${roomName}`}</strong>}.
                    </DialogDescription>
                </DialogHeader>

                <Button type="submit" onClick={handleCLick}>
                    Send
                </Button>
                <DialogClose
                    render={
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    }
                />
            </DialogContent>
        </Dialog>
    );
}
