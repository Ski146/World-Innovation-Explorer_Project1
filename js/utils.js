/**
 * Utility functions for the visualization
 */

// Comprehensive mapping from numeric ISO country codes to 3-letter codes
const ISO_NUMERIC_TO_ALPHA3 = {
    4: "AFG", 8: "ALB", 10: "ATA", 12: "DZA", 16: "AND", 20: "AGO", 24: "AGO", 28: "ATG", 
    32: "ARG", 36: "AUS", 40: "AUT", 44: "BHS", 48: "BHR", 50: "BGD", 52: "BRB", 56: "BEL", 
    60: "BMU", 64: "BTN", 68: "BOL", 70: "BIH", 72: "BWA", 76: "BRA", 84: "BLZ", 86: "BRN", 
    90: "SLB", 92: "BVT", 96: "BRN", 100: "BGR", 104: "MMR", 108: "BDI", 112: "KHM", 
    116: "CMR", 120: "CAN", 124: "CMR", 132: "CPV", 136: "CAF", 140: "TCD", 144: "LKA",
    148: "CHL", 152: "CHN", 156: "CHN", 158: "TWN", 162: "COL", 166: "COM", 170: "COG", 
    174: "GEQ", 175: "GEQ", 178: "COG", 180: "COD", 184: "COK", 188: "CRI", 191: "HRV", 
    192: "CUB", 196: "CYP", 203: "CZE", 208: "DNK", 212: "DMA", 214: "DOM", 218: "ECU", 
    222: "SLV", 226: "GNQ", 231: "ETH", 232: "ERI", 233: "EST", 238: "FLK", 242: "FJI", 
    246: "FIN", 250: "FRA", 254: "GUF", 258: "PYF", 260: "ATF", 262: "DJI", 266: "GAB", 
    268: "GMB", 270: "GEO", 276: "DEU", 288: "GHA", 292: "GIB", 296: "KIR", 300: "GRC", 
    304: "GRL", 308: "GRD", 312: "GRL", 316: "GUM", 320: "GTM", 324: "GIN", 328: "GNB", 
    332: "HTI", 334: "HMD", 336: "VAT", 340: "HND", 344: "HKG", 348: "HUN", 352: "ISL", 
    356: "IND", 360: "IDN", 364: "IRN", 368: "IRQ", 372: "IRL", 376: "ISR", 380: "ITA", 
    388: "JAM", 392: "JPN", 398: "KAZ", 400: "JOR", 404: "KEN", 408: "PRK", 410: "KOR", 
    414: "KWT", 417: "KGZ", 418: "LAO", 422: "LBN", 426: "LSO", 428: "LVA", 430: "LBR", 
    434: "LBY", 438: "LIE", 440: "LTU", 442: "LUX", 446: "MAC", 450: "MDG", 454: "MWI", 
    458: "MYS", 462: "MDV", 466: "MLI", 470: "MLT", 474: "MRT", 478: "MUS", 480: "MEX", 
    484: "MEX", 492: "MCO", 496: "MNG", 498: "MDA", 499: "MNE", 500: "MSR", 504: "MAR", 
    508: "MOZ", 512: "OMN", 516: "NAM", 520: "NRU", 524: "NPL", 528: "NLD", 531: "CUW", 
    533: "ABW", 534: "SXM", 540: "NCL", 548: "VUT", 554: "NZL", 558: "NIC", 562: "NGA", 
    566: "NER", 570: "NRU", 574: "NFK", 578: "NOR", 580: "MNP", 581: "UMI", 584: "PAK", 
    585: "PLW", 586: "PSE", 591: "PAN", 598: "PNG", 600: "PRY", 604: "PER", 608: "PHL", 
    612: "PCN", 616: "POL", 620: "PRT", 630: "PRI", 634: "QAT", 638: "REU", 642: "ROU", 
    643: "RUS", 646: "RWA", 652: "STP", 654: "SHN", 659: "KNA", 660: "AIA", 662: "LCA", 
    663: "MAF", 666: "VCT", 670: "KNA", 674: "SMR", 678: "STP", 682: "SAU", 686: "SEN", 
    688: "SRB", 690: "SYC", 694: "SLE", 702: "SGP", 703: "SVK", 704: "VNM", 705: "SVN", 
    706: "SOM", 710: "ZAF", 728: "SSD", 732: "ESH", 740: "SUR", 744: "SJM", 748: "SWZ", 
    752: "SWE", 756: "CHE", 760: "SYR", 762: "TWN", 764: "THA", 768: "TGO", 772: "TKL", 
    776: "TON", 780: "TTO", 784: "ARE", 788: "TUN", 792: "TUR", 795: "TKM", 796: "TCA", 
    798: "TUV", 800: "UGA", 804: "UKR", 807: "MKD", 818: "EGY", 826: "GBR", 831: "GGY", 
    832: "JEY", 833: "IMN", 834: "TZA", 840: "USA", 850: "VGB", 854: "BFA", 858: "URY", 
    860: "UZB", 862: "VEN", 876: "WLF", 887: "YEM", 894: "ZMB", 716: "ZWE"
};

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
        console.log('Data map contains codes:', Object.keys(dataMap).slice(0, 10), '...');
        let matchCount = 0;
        const unmatchedCodes = new Set();

        // Add data properties to features
        if (geoData && geoData.features) {
            geoData.features.forEach((feature, idx) => {
                // Try different property names for country code
                let code = feature.properties.id || 
                           feature.properties.CODE || 
                           feature.properties.code ||
                           feature.id;
                
                // Convert numeric ISO code to 3-letter code if needed
                if (typeof code === 'number' && ISO_NUMERIC_TO_ALPHA3[code]) {
                    code = ISO_NUMERIC_TO_ALPHA3[code];
                }
                
                if (idx < 3) {
                    console.log(`Feature ${idx}: original=${feature.properties.id || feature.id}, converted=${code}`);
                }
                
                if (code && dataMap[code]) {
                    feature.properties.internet = dataMap[code].internet;
                    feature.properties.space = dataMap[code].space;
                    feature.properties.name = dataMap[code].name;
                    feature.properties.id = code;
                    matchCount++;
                } else if (code) {
                    unmatchedCodes.add(code);
                }
            });
        }

        console.log(`Merged ${matchCount} countries with GeoJSON features out of ${geoData.features.length} features`);
        if (unmatchedCodes.size > 0) {
            console.warn('Sample unmatched codes:', Array.from(unmatchedCodes).slice(0, 10));
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
