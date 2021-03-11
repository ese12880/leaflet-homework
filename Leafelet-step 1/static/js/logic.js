// Store API query variables
var url = " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url, function(response) {
console.log(response.features);
createFeatures(response.features)
});
function getColor(d) {
    return (d >=5)  ? '#660033' :
           (d >=4)  ? '#ff0000' :
           (d >=3)  ? '#ff751a' :
           (d >= 2) ? '#ffbb33' :
           (d >=1)  ? '#ffff00' :
           (d >= 0)  ? '#4dff4d' :
                      '#ffffff';
};

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }  

   
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    style: function(feature) {
        // console.log(feature);
        
        return {
            fillColor: getColor(feature.properties.mag),
            weight: 2,
            opacity: 1,
            color: 'black',
            // fillcolor:'#06406F',
            fillOpacity: 0.85
        };
        // return {color: "#00FF57"};
    },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: feature.properties.mag*5});
    },
    onEachFeature: onEachFeature
  });
  
    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}