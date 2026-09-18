import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "POLARIS | Polar Expedition Command",
  description: "Advanced Polar Expedition Tracking & Telemetry System - SIH Prototype",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <div className="animate-in fade-in duration-1000">
          {children}
        </div>
      </body>
    </html>
  );
}