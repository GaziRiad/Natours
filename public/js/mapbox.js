/* eslint-disable */

const locations = JSON.parse(document.getElementById("map").dataset.location);
console.log(locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoicmlhZGRldiIsImEiOiJjbTM0NWx0eTAxb2wzMmlzODZzeXo1c3h1In0.fCfh11o_mXvMU8gR59MmKQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/riaddev/cm345z8vt011r01qw40z2hn37",
  // center: [-118.2437, 34.0522], // Coordinates for Los Angeles
  // zoom: 10, // Optional: Set an appropriate zoom level
  // projection: "globe",
  scrollZoom: false, // Disable zooming with scroll
  boxZoom: false, // Disable zooming with box selection
  doubleClickZoom: false, // Disable zooming with double click
  touchZoomRotate: false, // Disable zooming with touch gestures
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create a marker
  const el = document.createElement("div");
  el.className = "marker";

  // Add the marker
  new mapboxgl.Marker({ element: el, anchor: "bottom" })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Extends map bound to include current location
  bounds.extend(loc.coordinates);

  // Add a popup
  new mapboxgl.Popup({ offset: 30 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
});

map.fitBounds(bounds, {
  padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
