"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    await axios.delete(`/api/delete-message/${message._id}`);
    toast({
      title: "Message deleted",
      description: "Your message has been deleted",
    });
    onMessageDelete(message._id as string);
  };
  return (
    <Card>
      <CardHeader className="flex justify-between items-center ">
        <CardTitle>Card Title</CardTitle>
        <div className="flex items-center justify-between flex-row-reverse">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <X className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleDeleteConfirm();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardDescription className="">{message.content}</CardDescription>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default MessageCard;
