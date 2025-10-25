"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export function OrderMap({ address }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !address) return;

    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map.current);
    }

    const geocodeAddress = async () => {
      try {
        const addressString = `${address.street || ""}, ${
          address.city || ""
        }, ${address.state || ""}, ${address.postalCode || ""}, ${
          address.country || ""
        }`;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            addressString
          )}`
        );

        const results = await response.json();

        if (results && results.length > 0) {
          const { lat, lon } = results[0];
          const coordinates = [parseFloat(lat), parseFloat(lon)];

          map.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              map.current.removeLayer(layer);
            }
          });

          map.current.setView(coordinates, 14);

          L.marker(coordinates, {
            icon: L.icon({
              iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
              iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .bindPopup(
              `<div class="text-sm"><strong>${
                address.fullName || "Delivery Location"
              }</strong><br/>${addressString}</div>`
            )
            .addTo(map.current)
            .openPopup();
        } else {
          const defaultCoords = [20.5937, 78.9629];
          map.current.setView(defaultCoords, 13);

          L.marker(defaultCoords, {
            icon: L.icon({
              iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
              iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .bindPopup(
              `<div class="text-sm"><strong>${
                address.fullName || "Delivery Location"
              }</strong><br/>Address could not be located</div>`
            )
            .addTo(map.current)
            .openPopup();
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        const defaultCoords = [20.5937, 78.9629];
        map.current.setView(defaultCoords, 13);
      }
    };

    geocodeAddress();

    return () => {};
  }, [address]);

  return (
    <div
      ref={mapContainer}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      className="shadow-sm border border-slate-200"
    />
  );
}
