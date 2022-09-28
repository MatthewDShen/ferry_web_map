

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

        map.addSource('routes', { // Add routes data
            type: 'geojson',
            data: 'js/data/routes.geojson'
        })

        map.addLayer({ // Load routes data into map
            'id': 'routes-layer',
            'type': 'line',
            'source': 'routes',
            'paint': { // Change color of routes based on route name
                'line-color': [
                    'match',
                    ['get', 'route_id'],
                    'AS','#FF6900',
                    'ER','#228B9D',
                    'RW','#AD1AAC',
                    'SB','#fdd100',
                    'SG','#D7006E',
                    'SV','#4E008E',
                    'ERS','#B31B1B',
                    'RES','#c7d41e',
                    'RWS','#f3b632',
                    '#ccc'

                ],
                'line-width': 3
            }
        });

        map.addSource('stops', { // Load stops data
            type: 'geojson',
            data: 'js/data/stops.geojson'
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
                <strong>Stop: </strong>${name}
                `
            
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);

        });

        map.on('mouseenter', 'routes-layer', function(e) {
            // Change the cursor style as a UI indicator.
              map.getCanvas().style.cursor = 'pointer';
            
            // Get data from geojson
            const coordinates = e.lngLat;
            const name = e.features[0].properties.route_name;


            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            var popupContent = `
                <strong>Route: </strong>${name}
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

        // Timeline code //

        

        // Load ferry icon
        map.loadImage(
            'icons/NYC_Ferry_Vertical-removebg-preview.png',
            (error, image) => {
            if (error) throw error;
             
            // Add the image to the map style.
            map.addImage('ferry-icon', image);
            }
        );

        // Create array w/ each time stamp
        var x = 5; //minutes interval
        const times = []; // time array
        var tt = 285; // start time
    
        // loop to increment the time and push results in array
        for (var i=0;tt<24*60; i++) {
            var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
            var mm = (tt%60); // getting minutes of the hour in 0-55 format
            times[i] = ((hh)) + ':' + ("0" + mm).slice(-2);
            tt = tt + x;
        }

        // function to filter the geojson based on the timeid
        function filterBy(timestep) {
            const filters = ['==', 'time_id', timestep];
            map.setFilter('ships', filters);
            // Set the label to the time
            document.getElementById('current-time').textContent = times[timestep];
        }

        $.getJSON('js/data/stop-times.geojson',jsonCallback);


        function jsonCallback(data) {

            map.addSource('stop-times', {
                type: 'geojson',
                data: data
            });

            map.addLayer({
                'id': 'ships',
                'type': 'symbol',
                'source': 'stop-times',
                'layout': {
                'icon-image': 'ferry-icon',
                'icon-size': 0.04
                }
            });
    
            // Set filter to first month of the year
            // 0 = January
            filterBy(0);
    
            document.getElementById('slider').addEventListener('input', (e) => {
                const currenttime = parseInt(e.target.value, 10);
                filterBy(currenttime);
            });
        }


        







    



    });