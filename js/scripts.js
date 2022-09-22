//Create inital variables
var mapCenter = [-96,37]
var aircraft_range = 0

//Setting up Mabox GL & map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'
var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: mapCenter,
  zoom: 3.5,
});

// Get Airport Data & Create Dropdown
var airport_data = $.getJSON('data/all-airport-data.json', function(airport_data){
    for (var i = 0; i < airport_data.length; i++) {
        let latlng = [airport_data[i]['Latitude'],airport_data[i]['Longitude']]
        $('#sel').append('<option value=' + latlng + '>'
         + airport_data[i]['LocID'] + '</option>');
    }
    return airport_data
});


// Add/Change Marker & Range based on input

// Setup for logical statement to see if first marker
var update_marker = 'FALSE'

// Looks for changes in dropdown bar
$('#sel').change(function(){
    // If this is the first marker being placed
    if (update_marker == 'FALSE') {

        // Gets coordinates of first marker
        var coords = $('#sel').val().split(',').map(Number);
        coords = coords.reverse();

        // Places marker down and range cirlce
        start_marker = setMarkerAndRange(coords,aircraft_range)


        // Fly to marker
        zoomFunc(coords,aircraft_range);

        // Adjusts range cirlce if there is change in requested range
        $('#range').change(function(){
            map.removeLayer('polygon');
            map.removeSource('polygon');
            aircraft_range = $('#range').val();

            map.addSource("polygon", createGeoJSONCircle(coords,aircraft_range));

            map.addLayer({
                "id": "polygon",
                "type": "fill",
                "source": "polygon",
                "layout": {},
                "paint": {
                    "fill-color": "#57068C",
                    "fill-opacity": 0.6
                }
            });

            zoomFunc(coords,aircraft_range);
        });

        update_marker = 'TRUE'
        return start_marker

    }
    // When you are updating the marker
    else{

        // Removes initial marker and range map
        start_marker.remove();
        map.removeLayer('polygon');
        map.removeSource('polygon');

        //Gets coordinates of new airport
        coords = $('#sel').val().split(',').map(Number);
        coords = coords.reverse();

        //Sets marker and range circle
        start_marker = setMarkerAndRange(coords,aircraft_range)

        // Fly to marker
        zoomFunc(coords,aircraft_range);

        // Adjusts range cirlce if there is change in requested range
        $('#range').change(function(){
            map.removeLayer('polygon');
            map.removeSource('polygon');
            aircraft_range = $('#range').val();

            map.addSource("polygon", createGeoJSONCircle(coords,aircraft_range));

            map.addLayer({
                "id": "polygon",
                "type": "fill",
                "source": "polygon",
                "layout": {},
                "paint": {
                    "fill-color": "#57068C",
                    "fill-opacity": 0.6
                }
            });

            zoomFunc(coords,aircraft_range);
        });


        return start_marker

    }
})

//Function to set marker for airport and range cirlce
var setMarkerAndRange = function(coords,aircraft_range){

    const start_marker = new mapboxgl.Marker()
        .setLngLat(coords)
        .addTo(map);



    aircraft_range = $('#range').val();

    map.addSource("polygon", createGeoJSONCircle(coords,aircraft_range));

    map.addLayer({
        "id": "polygon",
        "type": "fill",
        "source": "polygon",
        "layout": {},
        "paint": {
            "fill-color": "#57068C",
            "fill-opacity": 0.6
        }
    });

    return start_marker


};

// Function to set zoom
var zoomFunc = function(coords){
    map.flyTo({
        center: coords,
        zoom: 10
    });
};

//Function to create cirlce
var createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};