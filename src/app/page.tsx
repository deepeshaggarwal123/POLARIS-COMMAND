"use client";
import React from "react";
import { AppProvider } from "@/store/appStore";
import AppShell from "@/components/AppShell";

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}