"use client";
import useSWR from "swr";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function OrderMap({ orderId }) {
  const { data: coordinates, isLoading } = useSWR(
    orderId ? `${BACKEND_URI}/api/orders/${orderId}/geocode` : null,
    fetcher
  );

  if (isLoading) return <div>Loading map...</div>;
  if (!coordinates) return <div>Could not load map for this address.</div>;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Map
          defaultCenter={coordinates}
          defaultZoom={14}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          <Marker position={coordinates} />
        </Map>
      </div>
    </APIProvider>
  );
}
