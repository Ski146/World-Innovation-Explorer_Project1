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
        
        // Debug: Check merged data
        const countriesWithData = mergedGeoData.features.filter(f => f.properties.internet !== undefined).length;
        console.log(`Debug: ${countriesWithData}/${mergedGeoData.features.length} countries have internet data`);
        
        // Display debug info on page
        const debugInfo = document.createElement('div');
        debugInfo.style.cssText = 'position: fixed; top: 10px; right: 10px; background: white; border: 2px solid #4A90E2; padding: 10px; z-index: 9999; max-width: 300px; font-family: monospace; font-size: 11px; max-height: 200px; overflow: auto;';
        debugInfo.innerHTML = `<strong>Debug Info:</strong><br>Features with internet data: ${countriesWithData}/${mergedGeoData.features.length}`;
        document.body.appendChild(debugInfo);
        
        if (countriesWithData < 50) {
            console.warn('Low merge success rate. Sample features:');
            for (let i = 0; i < Math.min(5, mergedGeoData.features.length); i++) {
                const f = mergedGeoData.features[i];
                const debugLine = `Feature ${i}: id=${f.properties.id || f.id}, internet=${f.properties.internet}`;
                debugInfo.innerHTML += `<br>${debugLine}`;
                console.log(debugLine);
            }
        }

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
