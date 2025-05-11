"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentServer } from "../../use-current-server";

export const ClientServer = () => {
  const server = useCurrentServer();

  if (!server) {
    return (
      <Card>
        <CardHeader>No server</CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
        <CardDescription>{server.slug}</CardDescription>
      </CardHeader>
    </Card>
  );
};
