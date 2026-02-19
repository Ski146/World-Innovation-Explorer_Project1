/**
 * Utility functions for the visualization
 */

const UTILS = {
    /**
     * Load GeoJSON data (handles both GeoJSON and TopoJSON)
     */
    loadGeoJSON: async function(url) {
        try {
            console.log('Fetching GeoJSON from:', url);
            const response = await fetch(url);
            let data = await response.json();
            
            // Check if it's TopoJSON and convert to GeoJSON
            if (data.objects) {
                console.log('Detected TopoJSON, converting to GeoJSON...');
                // Get the first object (usually "countries" or "world")
                const objectName = Object.keys(data.objects)[0];
                data = topojson.feature(data, data.objects[objectName]);
            }
            
            console.log('GeoJSON loaded successfully. Features:', data.features ? data.features.length : 0);
            
            return data;
        } catch (error) {
            console.error("Error loading GeoJSON:", error);
            return null;
        }
    },

    /**
     * Merge GeoJSON features with data
     */
    mergeGeoDataWithCountries: function(geoData, countriesData) {
        // Create a map for quick lookup
        const dataMap = {};
        countriesData.forEach(country => {
            dataMap[country.code] = country;
        });

        console.log('Merging country data with GeoJSON features...');
        let matchCount = 0;

        // Add data properties to features
        if (geoData && geoData.features) {
            geoData.features.forEach(feature => {
                // Try different property names for country code
                const code = feature.properties.id || 
                           feature.properties.CODE || 
                           feature.properties.code ||
                           feature.id;
                
                if (code && dataMap[code]) {
                    feature.properties.internet = dataMap[code].internet;
                    feature.properties.space = dataMap[code].space;
                    feature.properties.name = dataMap[code].name;
                    matchCount++;
                }
            });
        }

        console.log(`Merged ${matchCount} countries with GeoJSON features out of ${geoData.features.length} features`);
        return geoData;
    },

    /**
     * Show tooltip
     */
    showTooltip: function(event, content) {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = content;
        tooltip.classList.add('active');
        
        const x = event.pageX + 10;
        const y = event.pageY + 10;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    },

    /**
     * Hide tooltip
     */
    hideTooltip: function() {
        const tooltip = document.getElementById('tooltip');
        tooltip.classList.remove('active');
    },

    /**
     * Format number with 2 decimal places
     */
    formatNumber: function(value, decimals = 2) {
        if (value === null || value === undefined) return 'N/A';
        return parseFloat(value).toFixed(decimals);
    },

    /**
     * Get color scale for values
     */
    getColorScale: function(dataArray, colorRange = ['#f7fbff', '#08519c'], domain = null) {
        let min, max;
        
        if (domain) {
            min = domain[0];
            max = domain[1];
        } else {
            const validData = dataArray.filter(d => d !== null && d !== undefined);
            min = Math.min(...validData);
            max = Math.max(...validData);
        }

        return d3.scaleLinear()
            .domain([min, max])
            .range(colorRange);
    },

    /**
     * Abbreviate large numbers
     */
    abbreviateNumber: function(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toFixed(0);
    },

    /**
     * Create legend HTML
     */
    createLegend: function(scale, title, format = d => d.toFixed(1)) {
        const domain = scale.domain();
        const midPoint = (domain[0] + domain[1]) / 2;

        return `
            <div class="legend">
                <strong style="width: 100%; margin-bottom: 0.5rem;">Scale:</strong>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${scale(domain[0])}"></div>
                    <span>${format(domain[0])}</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${scale(midPoint)}"></div>
                    <span>${format(midPoint)}</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${scale(domain[1])}"></div>
                    <span>${format(domain[1])}</span>
                </div>
            </div>
        `;
    }
};
