// Initialize map centered on Hudson County
const map = L.map("map").setView([40.743, -74.052], 12);

// OpenStreetMap base layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Style for Hudson County boundary
function countyStyle() {
  return {
    color: "#2563eb",
    weight: 3,
    fillColor: "#3b82f6",
    fillOpacity: 0.15,
  };
}

// Load GeoJSON
fetch("data/hudson_county_fixed.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("GeoJSON file not found");
    }
    return response.json();
  })
  .then(data => {
    const geoLayer = L.geoJSON(data, {
      style: countyStyle,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <strong>Hudson County</strong><br/>
          Click for more data
        `);
      }
    }).addTo(map);

    // Zoom map to county bounds
    map.fitBounds(geoLayer.getBounds());
  })
  .catch(error => {
    console.error("Error loading GeoJSON:", error);
  });
