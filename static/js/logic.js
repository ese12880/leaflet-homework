// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson";


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
  // // Run the onEachFeature function once for each piece of data in the array
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

// An array which will be used to store created cityMarkers
var cityMarkers = [];


function createMap(earthquakes) {
  //  console.log(feature.properties.place);

  // Create our map, giving it the streetmap and earthquakes layers to display on load
    var map = L.map('mapid').setView([37.09,-95.71], 5);


    // Add all the cityMarkers to a new layer group.
    // Now we can handle them as one group instead of referencing each individually
   var cityLayer = L.layerGroup(cityMarkers);
    
    // Define variables for our tile layers
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
    light.addTo(map);
    
    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
    dark.addTo(map);

    var streetmap = [];
   
   // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    
   
  //      // Create our map, giving it the streetmap and earthquakes layers to display on load
    var map = L.map('mapid').setView([37.09,-95.71], 5);
   map.addLayer([streetmap, earthquakes]);
    L.layers(streetmap,earthquakes).addTo(map);
    
    var myMap = L.map ("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5
      ,layers: [streetmap, earthquakes]
    });

    // Create map object and set default layers
     
//  var legend = L.control({position: 'bottomright'});

//  legend.onAdd = function (mapBox) {
 
//      var div = L.DomUtil.create('div', 'info legend'),
//          grades = [0, 1, 2, 3, 4, 5]
//          labels = [];
 
    //  // loop through our density intervals and generate a label with a colored square for each interval
    //  for (var i = 0; i < grades.length; i++) {
    //      console.log(grades.length);
    //      div.innerHTML +=
    //          '<i style="background:' + getColor(grades[i]) + '"></i> ' +
    //          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    //  }
 
     return div;
 };
 
 legend.addTo(map);
