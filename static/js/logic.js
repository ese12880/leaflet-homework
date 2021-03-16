// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson";

// {
// type: "FeatureCollection",
// metadata: {
// generated: 1615486588000,
// url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson",
// title: "USGS Significant Earthquakes, Past Hour",
// status: 200,
// api: "1.10.3",
// count: 0
// },
// features: []
// }


d3.json(url, function(response) {
// console.log(response.features);
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

function createMap(earthquakes) {
    //  console.log(feature.properties.place);

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });


  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
   
   
   
   
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map ("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5
      ,layers: [streetmap, earthquakes]
    });

     
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function (map) {
 
     var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 1, 2, 3, 4, 5]
         labels = [];
 
     // loop through our density intervals and generate a label with a colored square for each interval
     for (var i = 0; i < grades.length; i++) {
         console.log(grades.length);
         div.innerHTML +=
             '<i style="background:' + getColor(grades[i]) + '"></i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     }
 
     return div;
 };
 
 legend.addTo(mapbox);

  }