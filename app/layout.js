import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { ClientLayout } from "@/components/ClientLayout";
import "@/app/_styles/global.css";
import "leaflet/dist/leaflet.css";
import { getThemeInitScript } from "@/lib/theme";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "Elysoria - Your E-commerce Destination",
  description: "Discover the best products online.",
  icons: {
    icon: "/images/Elysoria-logo.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaff" },
    { media: "(prefers-color-scheme: dark)", color: "#08070e" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
