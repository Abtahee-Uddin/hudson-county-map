// Initialize map
const map = L.map("map").setView([40.73, -74.06], 12);

// Base map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Styling function
function countyStyle() {
  return {
    color: "#2563eb",
    weight: 3,
    fillColor: "#60a5fa",
    fillOpacity: 0.2,
  };
}

// Load Hudson County boundary
fetch("data/boundaries/hudson_county_fixed.geojson")
  .then(res => {
    if (!res.ok) throw new Error("GeoJSON not found");
    return res.json();
  })
  .then(data => {
    const countyLayer = L.geoJSON(data, {
      style: countyStyle,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <strong>Hudson County, NJ</strong><br>
          Boundary layer
        `);
      }
    }).addTo(map);

    // Zoom to boundary
    map.fitBounds(countyLayer.getBounds());
  })
  .catch(err => {
    console.error("Error loading boundary:", err);
  });
