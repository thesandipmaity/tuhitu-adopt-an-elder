import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuHiTu Satya",
  description:
    "TuHiTu Satya connects volunteers, sponsors and community partners with elders through safe, regular companionship.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "https://res.cloudinary.com/s1yfknfm/image/upload/v1788437799/TuHiTu_Satya_Fav_Icon.png",
    shortcut:
      "https://res.cloudinary.com/s1yfknfm/image/upload/v1788437799/TuHiTu_Satya_Fav_Icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
