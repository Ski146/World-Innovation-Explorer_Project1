/**
 * Interactive features for Level 2
 * - Filter by internet adoption
 * - Click to select and highlight
 * - Live statistics
 * - Info panel
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
