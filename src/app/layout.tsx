"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "./editor-styles.css";

import { StateProvider, initialState, reducer } from "../lib/state";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StateProvider initialState={initialState} reducer={reducer}>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}
