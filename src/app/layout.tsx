import type { Metadata } from "next";
import { Cinzel, Lato } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Village Wine and Spirits | Newark Valley, NY | Premium Wine & Spirits",
  description: "Village Wine and Spirits in Newark Valley, NY offers premium wines, spirits, and craft beverages. Visit us at 20 South Main Street. Open Mon-Sat 10am-8pm, Sun 12pm-6pm. Call (607) 642-8836.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}
