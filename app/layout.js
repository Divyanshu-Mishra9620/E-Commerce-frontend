import { ClientLayout } from "@/components/ClientLayout";
import "@/app/_styles/global.css";
import "leaflet/dist/leaflet.css";
import { getThemeInitScript } from "@/lib/theme";

export const metadata = {
  title: "Elysoria - Your E-commerce Destination",
  description: "Discover the best products online.",
  icons: {
    icon: "/images/Elysoria-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
