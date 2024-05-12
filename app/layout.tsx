import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import '@stream-io/video-react-sdk/dist/css/styles.css';
import "react-datepicker/dist/react-datepicker.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yoom app",
  description: "Video calling app",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider appearance={
        {
          layout: {
            logoImageUrl: '/icons/yomo-logo.svg',
            socialButtonsVariant: 'iconButton'
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#0E78f9',
            colorBackground: '#1c1f2e',
            colorInputBackground: '#252a41',
            colorInputText: '#fff'

          }
        }
      }>
        <body className={`${inter.className} bg-dark-2`} >
          {children}
          <Toaster />
        </body>
      </ClerkProvider>
    </html >
  );
}
