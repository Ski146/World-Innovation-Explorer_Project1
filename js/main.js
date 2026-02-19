/**
 * Main application entry point
 * Loads data and initializes all visualizations with interactivity
 */

(async function() {
    try {
        // Load GeoJSON data
        console.log('Loading World GeoJSON...');
        const worldGeoData = await UTILS.loadGeoJSON(WORLD_GEOJSON_URL);

        if (!worldGeoData || !worldGeoData.features) {
            console.error('Failed to load GeoJSON data or missing features');
            document.body.innerHTML += '<p style="color: red; padding: 20px;">Error: Could not load geographic data.</p>';
            return;
        }

        console.log('GeoJSON loaded. Total features:', worldGeoData.features.length);

        // Merge country data with GeoJSON
        const mergedGeoData = UTILS.mergeGeoDataWithCountries(worldGeoData, DATA.countries);

        console.log('Creating visualizations...');

        // Create all visualizations
        VIZ.createInternetDistribution(DATA.countries);
        console.log('✓ Internet distribution created');
        
        VIZ.createSpaceDistribution(DATA.countries);
        console.log('✓ Space distribution created');
        
        VIZ.createScatterPlot(DATA.countries);
        console.log('✓ Scatter plot created');
        
        console.log('Creating maps...');
        VIZ.createInternetMap(mergedGeoData);
        console.log('✓ Internet map created');
        
        VIZ.createSpaceMap(mergedGeoData);
        console.log('✓ Space map created');

        // Initialize interactive features
        console.log('Initializing interactive features...');
        INTERACTIONS.init();
        console.log('✓ Interactions initialized');

        console.log('✅ Application ready!');

    } catch (error) {
        console.error('Error initializing application:', error);
        document.body.innerHTML += '<p style="color: red; padding: 20px;">Error loading visualization. Check console for details.</p>';
    }
})();
