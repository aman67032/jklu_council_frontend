import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jklu-council.vercel.app'), // Replace with actual domain
  title: {
    default: "JKLU Student Council & Clubs",
    template: "%s | JKLU Council"
  },
  description: "Official digital platform for JKLU Student Council and Clubs. Explore events, join clubs, and stay updated with campus life at JK Lakshmipat University.",
  keywords: ["JKLU", "JK Lakshmipat University", "Student Council", "Clubs", "JKLU Council", "Events", "Jaipur University", "Student Life", "Campus Activities", "Council of JKLU"],
  authors: [{ name: "JKLU Council Tech Team" }],
  creator: "JKLU Student Council",
  publisher: "JK Lakshmipat University",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jklu-council.vercel.app",
    title: "JKLU Student Council & Clubs",
    description: "Connect, Engage, and Lead with the JKLU Student Council and Clubs network.",
    siteName: "JKLU Council",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "JKLU Council Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JKLU Student Council & Clubs",
    description: "Official digital platform for JKLU Student Council and Clubs.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "JKLU Student Council",
              "url": "https://jklu-council.vercel.app",
              "logo": "https://jklu-council.vercel.app/logos/CouncilLogo.png",
              "description": "The official student body of JK Lakshmipat University, dedicated to fostering leadership, culture, and innovation.",
              "parentOrganization": {
                "@type": "CollegeOrUniversity",
                "name": "JK Lakshmipat University",
                "url": "https://www.jklu.edu.in"
              },
              "sameAs": [
                "https://www.instagram.com/jklu_studentcouncil",
                "https://www.linkedin.com/company/jklu-student-council"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
