import "./globals.css";
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.intrusionscope.site'),
  title: {
    template: "%s | IntrusionScope",
    default: "IntrusionScope — Real-time Security Intelligence for Modern SecOps",
  },
  description:
    "Deep-dive CVE analysis, zero-day disclosures, and rapid remediation strategies for critical vulnerabilities across the global software supply chain.",
  keywords: [
    "cybersecurity",
    "CVE",
    "vulnerability",
    "threat intelligence",
    "zero-day",
    "security advisory",
    "IntrusionScope",
  ],
  authors: [{ name: "IntrusionScope" }],
  creator: "IntrusionScope",
  publisher: "IntrusionScope",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    title: "IntrusionScope — Real-time Security Intelligence for Modern SecOps",
    description:
      "Deep-dive CVE analysis, zero-day disclosures, and rapid remediation strategies for critical vulnerabilities across the global software supply chain.",
    url: "/",
    siteName: "IntrusionScope",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Banner.png",
        width: 1500,
        height: 750,
        alt: "IntrusionScope — Real Time Intel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntrusionScope — Real-time Security Intelligence for Modern SecOps",
    description:
      "Deep-dive CVE analysis, zero-day disclosures, and rapid remediation strategies for critical vulnerabilities.",
    images: ["/Banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col selection:bg-primary/30 font-sans">
        {children}
      </body>
    </html>
  );
}
