import { ClientLayout } from "@/components/ClientLayout";
import "@/app/_styles/global.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Elysoria - Your E-commerce Destination",
  description: "Discover the best products online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
