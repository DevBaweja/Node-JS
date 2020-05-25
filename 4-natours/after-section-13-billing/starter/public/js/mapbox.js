/* eslint-disable */

export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiZGV2YmF3ZWphIiwiYSI6ImNrYWoybXQ2MzA2b3Iyc281M25zcW1sdzMifQ.X8SF6_QRE840cxVbcrI4aQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/devbaweja/ckaj2s9xx08gy1immpo97xsgf',
        scrollZoom: false,
    });
    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add Popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
        // Extends map bounds
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};
