import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "../providers/auth-provider";
import { getServerSession } from "next-auth";
import StoreProvider from "@/providers/store-provider";

export const metadata: Metadata = {
  title: "Medium",
  description: "Medium clone project",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <StoreProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
