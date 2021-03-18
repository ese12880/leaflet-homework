// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";




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
           (d >= -0)  ? '#4dff4d' :
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
    
    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });

    var streetmap = [];
   
   // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    
   
  // Create our map, giving it the streetmap and earthquakes layers to display on load
    var map = L.map('mapid').setView([37.09,-95.71], 5);
    light.addTo(map);
    // dark.addTo(map);
    earthquakes.addTo(map);        

    // Create map object and set default layers
     
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function (map) {
 
     var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += '<i style="background: #660033"> </i><span>5+</span><br>';
    div.innerHTML += '<i style="background: #ff0000"> </i><span>4-4</span><br>';
    div.innerHTML += '<i style="background: #ff751a"> </i><span>3-3</span><br>';
    div.innerHTML += '<i style="background: #ffbb33"> </i><span>2-2</span><br>';
    div.innerHTML += '<i style="background: #ffff00"> </i><span>1-1</span><br>';
    div.innerHTML += '<i style="background: #4dff4d"> </i><span>0-0</span><br>';
    div.innerHTML += '<i style="background: #ffffff"> </i><span><0</span><br>';
 
    return div;
 };
 
 legend.addTo(map)
};