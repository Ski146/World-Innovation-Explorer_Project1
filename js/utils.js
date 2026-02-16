/**
 * Utility functions for the visualization
 */

const UTILS = {
    /**
     * Load GeoJSON data
     */
    loadGeoJSON: async function(url) {
        try {
            const response = await fetch(url);
            return await response.json();
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

        // Add data properties to features
        if (geoData && geoData.features) {
            geoData.features.forEach(feature => {
                const code = feature.properties.id;
                if (dataMap[code]) {
                    feature.properties.internet = dataMap[code].internet;
                    feature.properties.space = dataMap[code].space;
                    feature.properties.name = dataMap[code].name;
                }
            });
        }

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
