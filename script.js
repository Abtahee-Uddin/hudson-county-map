// Initialize map
const map = L.map("map").setView([40.73, -74.06], 12);

// Base map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

/* -------------------------
   STYLES
-------------------------- */

const countyStyle = {
  color: "#2563eb",
  weight: 3,
  fillColor: "#60a5fa",
  fillOpacity: 0.15,
};

const roadStyle = {
  color: "#f97316",
  weight: 2,
};

const buildingStyle = {
  color: "#6b7280",
  weight: 1,
  fillColor: "#9ca3af",
  fillOpacity: 0.6,
};

/* -------------------------
   LOAD COUNTY
-------------------------- */

fetch("data/boundaries/hudson_county_fixed.geojson")
  .then(res => res.json())
  .then(data => {
    const countyLayer = L.geoJSON(data, {
      style: countyStyle,
    }).addTo(map);

    map.fitBounds(countyLayer.getBounds());
  });

/* -------------------------
   LOAD ROADS
-------------------------- */

fetch("data/infrastructure/hudsonroads.geojson")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: roadStyle,
      onEachFeature: (feature, layer) => {

        // Tooltip text (safe fallback)
        const name =
          feature.properties?.name ||
          feature.properties?.road_name ||
          "Road";

        layer.bindTooltip(name, {
          sticky: true,
        });

        // Hover highlight
        layer.on({
          mouseover: e => {
            e.target.setStyle({
              weight: 4,
              color: "#ea580c",
            });
          },
          mouseout: e => {
            e.target.setStyle(roadStyle);
          },
        });
      },
    }).addTo(map);
  });

/* -------------------------
   LOAD BUILDINGS
-------------------------- */

fetch("data/infrastructure/hudsonbuildings.geojson")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: buildingStyle,
      onEachFeature: (feature, layer) => {

        const bldgName =
          feature.properties?.name ||
          feature.properties?.building ||
          "Building";

        layer.bindTooltip(bldgName, {
          sticky: true,
        });

        layer.on({
          mouseover: e => {
            e.target.setStyle({
              fillOpacity: 0.9,
              color: "#374151",
            });
          },
          mouseout: e => {
            e.target.setStyle(buildingStyle);
          },
        });
      },
    }).addTo(map);
  });
