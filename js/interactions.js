/**
 * Interactive features for Level 3
 * - Filter by internet adoption
 * - Click to select and highlight
 * - Live statistics
 * - Detailed country profiles with rankings
 */

let currentFilter = 'all';
let selectedCountry = null;

const INTERACTIONS = {
    /**
     * Initialize all interactive features
     */
    init: function() {
        this.setupFilterButtons();
        this.setupCountryClickHandlers();
        this.updateStats();
    },

    /**
     * Setup filter button handlers
     */
    setupFilterButtons: function() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                document.querySelectorAll('.control-btn').forEach(b => 
                    b.classList.remove('active')
                );
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update filter
                currentFilter = e.target.dataset.filter;
                
                // Apply filtering
                INTERACTIONS.applyFilter(currentFilter);
                INTERACTIONS.updateStats();
            });
        });
    },

    /**
     * Apply filter based on internet adoption levels
     */
    applyFilter: function(filter) {
        const filteredCountries = DATA.countries.filter(country => {
            if (filter === 'all') return true;
            if (filter === 'low') return country.internet < 33;
            if (filter === 'medium') return country.internet >= 33 && country.internet <= 66;
            if (filter === 'high') return country.internet > 66;
            return true;
        });

        // Apply visual filtering to dots
        d3.selectAll('circle.dot')
            .classed('faded', d => !filteredCountries.find(c => c.name === d.name))
            .classed('highlighted', false);

        // Apply visual filtering to bars
        d3.selectAll('rect.bar')
            .classed('faded', function(d) {
                if (d.name) return !filteredCountries.find(c => c.name === d.name);
                return false;
            })
            .classed('highlighted', false);

        // Apply visual filtering to map countries
        d3.selectAll('path.country')
            .classed('faded', d => {
                const code = d.properties.id || d.properties.code;
                return !filteredCountries.find(c => c.code === code);
            })
            .classed('highlighted', false);
    },

    /**
     * Setup click handlers for countries in visualizations
     */
    setupCountryClickHandlers: function() {
        // Handled in visualizations.js via on('click') events
    },

    /**
     * Select a country and highlight across all visualizations
     */
    selectCountry: function(name, internet, space, code) {
        selectedCountry = { name, internet, space, code };

        // Highlight in dots
        d3.selectAll('.dot')
            .classed('highlighted', d => d.name === name)
            .classed('faded', d => d.name !== name && currentFilter !== 'all' ? 
                !this.passesFilter(d.internet) : d.name !== name && currentFilter !== 'all');

        // Highlight on maps
        d3.selectAll('.country')
            .classed('highlighted', d => 
                d.properties.name === name || d.properties.id === code
            );

        // Show detailed info panel (Level 3)
        this.showDetailedProfile(name, internet, space, code);

        // Update stats
        this.updateStats();
    },

    /**
     * Check if country passes current filter
     */
    passesFilter: function(internetValue) {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'low') return internetValue < 33;
        if (currentFilter === 'medium') return internetValue >= 33 && internetValue <= 66;
        if (currentFilter === 'high') return internetValue > 66;
        return true;
    },

    /**
     * Calculate country rankings and statistics
     */
    calculateRankings: function(countryName, metric = 'internet') {
        const countries = DATA.countries.sort((a, b) => {
            if (metric === 'internet') return b.internet - a.internet;
            if (metric === 'space') return b.space - a.space;
            return 0;
        });

        const rank = countries.findIndex(c => c.name === countryName) + 1;
        const total = countries.length;
        const percentile = Math.round(((total - rank + 1) / total) * 100);

        return { rank, total, percentile };
    },

    /**
     * Get global statistics
     */
    getGlobalStats: function() {
        const internetValues = DATA.countries.map(c => c.internet);
        const spaceValues = DATA.countries.map(c => c.space).filter(v => v > 0);

        return {
            avgInternet: (internetValues.reduce((a, b) => a + b) / internetValues.length).toFixed(1),
            medianInternet: this.getMedian(internetValues).toFixed(1),
            minInternet: Math.min(...internetValues).toFixed(1),
            maxInternet: Math.max(...internetValues).toFixed(1),
            avgSpace: (spaceValues.reduce((a, b) => a + b, 0) / (spaceValues.length || 1)).toFixed(1),
            countriesWithSpace: spaceValues.length
        };
    },

    /**
     * Calculate median value
     */
    getMedian: function(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    /**
     * Show detailed info panel with L3 features
     */
    showDetailedProfile: function(name, internet, space, code) {
        const country = DATA.countries.find(c => c.name === name);
        if (!country) return;

        const internetRank = this.calculateRankings(name, 'internet');
        const spaceRank = this.calculateRankings(name, 'space');
        const globals = this.getGlobalStats();

        // Calculate comparisons
        const internetDiff = (internet - globals.avgInternet).toFixed(1);
        const internetDiffSign = internetDiff > 0 ? '+' : '';
        const spaceDiff = space > 0 ? ((space / (globals.avgSpace || 1)) * 100 - 100).toFixed(0) : 'N/A';

        const panel = document.getElementById('info-panel');
        document.getElementById('info-country-name').textContent = name;

        // Enhanced content with Level 3 details
        document.getElementById('info-content').innerHTML = `
            <!-- Primary Metrics -->
            <div class="profile-section">
                <h4 class="section-header">📊 Primary Metrics</h4>
                <div class="info-stat">
                    <span class="info-label">Internet Usage:</span>
                    <span class="info-value">${UTILS.formatNumber(internet)}%</span>
                </div>
                <div class="info-stat">
                    <span class="info-label">Space Objects:</span>
                    <span class="info-value">${space}</span>
                </div>
            </div>

            <!-- Rankings -->
            <div class="profile-section">
                <h4 class="section-header">🏆 Global Rankings</h4>
                <div class="info-stat">
                    <span class="info-label">Internet Rank:</span>
                    <span class="info-value">#${internetRank.rank} of ${internetRank.total} (${internetRank.percentile}th percentile)</span>
                </div>
                <div class="info-stat">
                    <span class="info-label">Space Rank:</span>
                    <span class="info-value">${space > 0 ? `#${spaceRank.rank} of ${spaceRank.total}` : 'No space activity'}</span>
                </div>
            </div>

            <!-- Comparisons -->
            <div class="profile-section">
                <h4 class="section-header">📈 Global Comparison</h4>
                <div class="info-stat">
                    <span class="info-label">vs Global Internet Avg:</span>
                    <span class="info-value" style="color: ${internetDiff > 0 ? '#27ae60' : '#e74c3c'};">
                        ${internetDiffSign}${internetDiff} pp
                    </span>
                </div>
                <div class="info-stat">
                    <span class="info-label">vs Global Space Avg:</span>
                    <span class="info-value">
                        ${spaceDiff !== 'N/A' ? spaceDiff + '%' : spaceDiff}
                    </span>
                </div>
                <div class="info-stat">
                    <span class="info-label">Global Internet Avg:</span>
                    <span class="info-value">${globals.avgInternet}%</span>
                </div>
                <div class="info-stat">
                    <span class="info-label">Global Space Avg:</span>
                    <span class="info-value">${globals.avgSpace}</span>
                </div>
            </div>

            <!-- Category -->
            <div class="profile-section">
                <h4 class="section-header">🏷️ Category</h4>
                <div class="info-stat">
                    <span class="info-label">Internet Category:</span>
                    <span class="info-value">
                        ${internet < 33 ? '🔴 Low' : internet <= 66 ? '🟡 Medium' : '🟢 High'}
                    </span>
                </div>
                <div class="info-stat">
                    <span class="info-label">Space Activity:</span>
                    <span class="info-value">
                        ${space > 0 ? '🚀 Active' : '⭕ No Activity'}
                    </span>
                </div>
            </div>

            <!-- Country Code -->
            <div class="profile-section">
                <div class="info-stat">
                    <span class="info-label">Country Code:</span>
                    <span class="info-value">${code || '--'}</span>
                </div>
            </div>
        `;

        panel.style.display = 'block';
    },

    /**
     * Close info panel
     */
    closeInfoPanel: function() {
        selectedCountry = null;
        document.getElementById('info-panel').style.display = 'none';
        
        // Remove highlighting
        d3.selectAll('.dot').classed('highlighted', false).classed('faded', false);
        d3.selectAll('.country').classed('highlighted', false).classed('faded', false);
        
        this.updateStats();
    },

    /**
     * Update statistics panel
     */
    updateStats: function() {
        // Filter countries based on current filter
        const filtered = DATA.countries.filter(c => this.passesFilter(c.internet));
        
        const countryCount = filtered.length;
        const avgInternet = (filtered.reduce((sum, c) => sum + c.internet, 0) / filtered.length).toFixed(1);
        const spaceActive = filtered.filter(c => c.space > 0).length;
        
        document.getElementById('stat-countries').textContent = countryCount;
        document.getElementById('stat-internet').textContent = avgInternet + '%';
        document.getElementById('stat-space').textContent = spaceActive;
        document.getElementById('stat-selected').textContent = selectedCountry ? selectedCountry.name : 'None';
    }
};

/**
 * Global functions for HTML onclick handlers
 */
function closeInfoPanel() {
    INTERACTIONS.closeInfoPanel();
}
            if (filter === 'low') return country.internet < 33;
            if (filter === 'medium') return country.internet >= 33 && country.internet <= 66;
            if (filter === 'high') return country.internet > 66;
            return true;
        });

        // Fade non-matching countries in visualizations
        d3.selectAll('.bar').classed('faded', d => 
            !filteredCountries.find(c => c.name === d.name || c.internet === d.x0)
        );

        d3.selectAll('.dot').classed('faded', d => 
            !filteredCountries.find(c => c.name === d.name)
        );

        d3.selectAll('.country').classed('faded', feature => {
            const countryData = filteredCountries.find(c => 
                c.code === feature.properties.id || c.name === feature.properties.name
            );
            return !countryData;
        });
    },

    /**
     * Setup click handlers for country selection
     */
    setupCountryClickHandlers: function() {
        // Dots in scatter plot
        d3.selectAll('.dot').on('click', (event, d) => {
            event.stopPropagation();
            INTERACTIONS.selectCountry(d.name, d.internet, d.space, d.code);
        });

        // Countries on maps
        d3.selectAll('.country').on('click', (event, d) => {
            event.stopPropagation();
            const name = d.properties.name || 'Unknown';
            const code = d.properties.id;
            const internet = d.properties.internet || 0;
            const space = d.properties.space || 0;
            INTERACTIONS.selectCountry(name, internet, space, code);
        });

        // Bars in distribution charts (get from data)
        document.addEventListener('click', (e) => {
            const bar = e.target.closest('.bar');
            if (bar && bar.__data__) {
                // This will be handled by visualization-specific clicks
            }
        });
    },

    /**
     * Select a country and highlight across all visualizations
     */
    selectCountry: function(name, internet, space, code) {
        selectedCountry = { name, internet, space, code };

        // Highlight in dots
        d3.selectAll('.dot')
            .classed('highlighted', d => d.name === name)
            .classed('faded', d => currentFilter !== 'all' && d.name !== name ? 
                !this.passesFilter(d.internet) : d.name !== name && currentFilter !== 'all');

        // Highlight on maps
        d3.selectAll('.country')
            .classed('highlighted', d => 
                d.properties.name === name || d.properties.id === code
            );

        // Show info panel
        this.showInfoPanel(name, internet, space, code);

        // Update stats
        this.updateStats();
    },

    /**
     * Check if country passes current filter
     */
    passesFilter: function(internetValue) {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'low') return internetValue < 33;
        if (currentFilter === 'medium') return internetValue >= 33 && internetValue <= 66;
        if (currentFilter === 'high') return internetValue > 66;
        return true;
    },

    /**
     * Show info panel with country details
     */
    showInfoPanel: function(name, internet, space, code) {
        const panel = document.getElementById('info-panel');
        document.getElementById('info-country-name').textContent = name;
        document.getElementById('info-internet').textContent = UTILS.formatNumber(internet) + '%';
        document.getElementById('info-space').textContent = space;
        document.getElementById('info-code').textContent = code || '--';
        panel.style.display = 'block';
    },

    /**
     * Close info panel
     */
    closeInfoPanel: function() {
        selectedCountry = null;
        document.getElementById('info-panel').style.display = 'none';
        
        // Remove highlighting
        d3.selectAll('.dot').classed('highlighted', false).classed('faded', false);
        d3.selectAll('.country').classed('highlighted', false).classed('faded', false);
        
        this.updateStats();
    },

    /**
     * Update statistics
     */
    updateStats: function() {
        // Filter countries based on current filter
        const filtered = DATA.countries.filter(c => this.passesFilter(c.internet));
        
        const countryCount = filtered.length;
        const avgInternet = (filtered.reduce((sum, c) => sum + c.internet, 0) / filtered.length).toFixed(1);
        const spaceActive = filtered.filter(c => c.space > 0).length;
        
        document.getElementById('stat-countries').textContent = countryCount;
        document.getElementById('stat-internet').textContent = avgInternet + '%';
        document.getElementById('stat-space').textContent = spaceActive;
        document.getElementById('stat-selected').textContent = selectedCountry ? selectedCountry.name : 'None';
    }
};

/**
 * Global functions for HTML onclick handlers
 */
function closeInfoPanel() {
    INTERACTIONS.closeInfoPanel();
}
