import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Execution - Your Personal Productivity Partner",
  description: "An intelligent daily execution and life management system with proof-based task completion, streak tracking, and achievement milestones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
