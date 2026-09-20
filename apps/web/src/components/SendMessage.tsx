import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { EscapeRoomType } from "@global-types/src";
import { useState } from "react";
import type { Socket } from "socket.io-client";

export function SendMessage({
    roomName,
    socket,
}: {
    roomName: EscapeRoomType["name"];
    socket: Socket;
}) {
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const successToast = () => {
        toast.add({
            type: "success",
            description: `Message sent to ${roomName}`,
        });
    };

    const errorToast = () => {
        toast.add({
            type: "error",
            description: "Error sending message. Try again.",
        });
    };

    const handleSubmit = () => {
        try {
            socket.emit("message:send", message);
            successToast();
            setMessage("");
            setOpen(false);
        } catch (error) {
            socket.emit("admin:error", error);
            errorToast();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={<Button type="button">Send Message</Button>}
            />
            <DialogContent className="sm:max-w-sm">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Send a message</DialogTitle>
                        <DialogDescription>
                            You're sending a message to Room:{" "}
                            {<strong>{`${roomName}`}</strong>}.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-4">
                        <Field>
                            <FieldLabel htmlFor="message">Message</FieldLabel>
                            <FieldDescription>
                                Enter your message below.
                            </FieldDescription>
                            <Textarea
                                id="message"
                                placeholder="Type your message here."
                                className="mb-4"
                                onChange={(e) => {
                                    setMessage(e.target.value.trim());
                                }}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            }
                        />
                        <Button type="submit" disabled={!message}>
                            Send
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
