/**
 * Main application entry point
 * Loads data and initializes all visualizations
 */

(async function() {
    try {
        // Load GeoJSON data
        console.log('Loading World GeoJSON...');
        const worldGeoData = await UTILS.loadGeoJSON(WORLD_GEOJSON_URL);

        if (!worldGeoData) {
            console.error('Failed to load GeoJSON data');
            return;
        }

        // Merge country data with GeoJSON
        const mergedGeoData = UTILS.mergeGeoDataWithCountries(worldGeoData, DATA.countries);

        console.log('Creating visualizations...');

        // Create all visualizations
        VIZ.createInternetDistribution(DATA.countries);
        VIZ.createSpaceDistribution(DATA.countries);
        VIZ.createScatterPlot(DATA.countries);
        VIZ.createInternetMap(mergedGeoData);
        VIZ.createSpaceMap(mergedGeoData);

        console.log('Visualizations created successfully!');

    } catch (error) {
        console.error('Error initializing application:', error);
        document.body.innerHTML += '<p style="color: red; padding: 20px;">Error loading visualization. Check console for details.</p>';
    }
})();
