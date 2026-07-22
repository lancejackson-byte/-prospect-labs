"use client";

import { type ReactNode } from "react";
import { TourProvider } from "./tour-provider";
import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";

interface TourShellProps {
  children: ReactNode;
  userId?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function TourShell({
  children,
  userId,
  userEmail,
  userAvatar,
}: TourShellProps) {
  return (
    <TourProvider userId={userId}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-64 flex flex-1 flex-col">
          <Header userEmail={userEmail} userAvatar={userAvatar} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </TourProvider>
  );
}
