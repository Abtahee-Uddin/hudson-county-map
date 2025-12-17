/* =========================
   MAP SETUP
========================= */

const map = L.map("map").setView([40.73, -74.06], 12);

// Base map
const baseLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
  }
).addTo(map);

/* =========================
   STYLES
========================= */

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

/* =========================
   LAYER GROUPS
========================= */

let countyLayer;
let roadsLayer;
let buildingsLayer;

/* =========================
   LOAD COUNTY
========================= */

fetch("data/boundaries/hudson_county_fixed.geojson")
  .then(res => res.json())
  .then(data => {
    countyLayer = L.geoJSON(data, {
      style: countyStyle,
    }).addTo(map);

    map.fitBounds(countyLayer.getBounds());
  });

/* =========================
   LOAD ROADS
========================= */

fetch("data/infrastructure/hudsonroads.geojson")
  .then(res => res.json())
  .then(data => {
    roadsLayer = L.geoJSON(data, {
      style: roadStyle,
      onEachFeature: (feature, layer) => {

        const roadName =
          feature.properties?.name ||
          feature.properties?.road_name ||
          "Road";

        layer.bindTooltip(roadName, { sticky: true });

        layer.on({
          mouseover: e => {
            e.target.setStyle({
              weight: 4,
              color: "#ea580c",
            });
          },
          mouseout: e => {
            roadsLayer.resetStyle(e.target);
          },
        });
      },
    });

    roadsLayer.addTo(map);
    updateLayerControl();
  });

/* =========================
   LOAD BUILDINGS
========================= */

fetch("data/infrastructure/hudsonbuildings.geojson")
  .then(res => res.json())
  .then(data => {
    buildingsLayer = L.geoJSON(data, {
      style: buildingStyle,
      onEachFeature: (feature, layer) => {

        const buildingName =
          feature.properties?.name ||
          feature.properties?.building ||
          "Building";

        layer.bindTooltip(buildingName, { sticky: true });

        layer.on({
          mouseover: e => {
            e.target.setStyle({
              fillOpacity: 0.9,
              color: "#374151",
            });
          },
          mouseout: e => {
            buildingsLayer.resetStyle(e.target);
          },
        });
      },
    });

    buildingsLayer.addTo(map);
    updateLayerControl();
  });

/* =========================
   LAYER CONTROL
========================= */

let layerControl;

function updateLayerControl() {
  if (layerControl) {
    map.removeControl(layerControl);
  }

  const overlays = {};

  if (countyLayer) overlays["County Boundary"] = countyLayer;
  if (roadsLayer) overlays["Roads"] = roadsLayer;
  if (buildingsLayer) overlays["Buildings"] = buildingsLayer;

  layerControl = L.control.layers(
    { "OpenStreetMap": baseLayer },
    overlays,
    { collapsed: false }
  ).addTo(map);
}
