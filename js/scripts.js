// Create inital variables
var mapCenter = [-73.99,40.75] // Map center locations

const bounds = [ // maximum bounds of map
    [-74.2, 40.4], // Southwest coordinates
    [-73.6, 41] // Northeast coordinates
    ];

//Setting up Mapbox GL & map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A' // MapboxGL token

    const map = new mapboxgl.Map({ // Create map
        container: 'map', // Assign container
        style: 'mapbox://styles/mapbox/dark-v10', // Map style
        center: mapCenter, // Set center of map
        zoom: 11, // Set zoom distance
        maxBounds: bounds // Set the map's geographical boundaries.
    });

    map.on('load', () => { // When map is loaded run the following functions

        map.addSource('stops', { // Load stops data
            type: 'geojson',
            data: 'data/stops.geojson'
        })

        map.addLayer({ // Add stops data to map
            'id': 'stops-layer',
            'type': 'circle',
            'source': 'stops',
            'paint': { // Style of stops
                'circle-color': '#B31B1B',
                'circle-radius': 5,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
                }
            });

        map.addSource('routes', { // Add routes data
            type: 'geojson',
            data: 'data/routes.geojson'
        })

        map.addLayer({ // Load routes data into map
            'id': 'routes-layer',
            'type': 'line',
            'source': 'routes',
            'paint': { // Change color of routes based on route name
                'line-color': [
                    'match',
                    ['get', 'route_name'],
                    'AS','#FF6900',
                    'ER','#228B9D',
                    'RW','#AD1AAC',
                    'SB','#fdd100',
                    'SG','#D7006E',
                    'SV','#4E008E',
                    '#ccc'

                ],
                'line-width': 3
            }
        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'stops-layer', function(e) {
            // Change the cursor style as a UI indicator.
              map.getCanvas().style.cursor = 'pointer';
            
            // Get data from geojson
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.stop_name;


            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var popupContent = `
                <strong>Name: </strong>${name}
                `
            
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);

        });

        map.on('mouseenter', 'routes-layer', function(e) {
            // Change the cursor style as a UI indicator.
              map.getCanvas().style.cursor = 'pointer';
            
            // Get data from geojson
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.stop_name;


            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var popupContent = `
                <strong>Name: </strong>${name}
                `
            
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);

        });



        map.on('mouseleave', 'stops-layer', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

        map.on('mouseleave', 'routes-layer', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });


async function getLocation(updateSource) {
    // Make a GET request to the API and return the location of the ISS.
    try {
        const response = await fetch(
            'http://nycferry.connexionz.net/rtt/public/utility/gtfsrealtime.aspx/tripupdate',
            { method: 'GET' }
    );
    const { latitude, longitude } = await response.json();
    
    // Return the location of the ISS as GeoJSON.
    return {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [longitude, latitude]
            }
        }]
    };
    } catch (err) {
    // If the updateSource interval is defined, clear the interval to stop updating the source.
    if (updateSource) clearInterval(updateSource);
    throw new Error(err);
    }
}
