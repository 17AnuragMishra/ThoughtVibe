import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "ThoughtVibe - Share Your Thoughts",
  description: "A modern blogging platform for sharing your thoughts and ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
          rel="stylesheet" 
        />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
