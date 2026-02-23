/**
 * Level 4: Advanced Features
 * - Time-Series Animation (2010-2024)
 * - Multi-Country Comparison
 * - Historical trends visualization
 */

const LEVEL4 = {
    currentYear: 2024,
    historicalData: [],
    isAnimating: false,
    selectedCountries: [],

    /**
     * Generate historical data for all countries (2010-2024)
     */
    generateHistoricalData: function() {
        const years = Array.from({length: 15}, (_, i) => 2010 + i);
        
        this.historicalData = years.map(year => {
            const yearData = {};
            DATA.countries.forEach(country => {
                // Simulate growth patterns based on 2024 values
                const yearFraction = (year - 2010) / 14;
                
                // Internet adoption: grows from lower baseline to 2024 value
                const internetGrowth = country.internet >= 80 ? 0.4 : 
                                      country.internet >= 50 ? 0.5 : 0.6;
                const internetBaseline = country.internet * (1 - internetGrowth);
                yearData[country.code] = {
                    ...country,
                    internet: internetBaseline + (country.internet - internetBaseline) * yearFraction,
                    space: Math.round(country.space * yearFraction * 1.2), // Space grows differently
                    year: year
                };
            });
            yearData.year = year;
            return yearData;
        });
        
        console.log('Historical data generated for years 2010-2024');
    },

    /**
     * Initialize Level 4 features
     */
    init: function() {
        this.generateHistoricalData();
        this.setupTimelineControls();
        this.setupComparisonControls();
        this.createTimeSeriesCharts(2024);
    },

    /**
     * Setup timeline play/pause controls
     */
    setupTimelineControls: function() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const yearSlider = document.getElementById('year-slider');
        const yearDisplay = document.getElementById('year-display');

        playBtn.addEventListener('click', () => {
            this.startAnimation();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        });

        pauseBtn.addEventListener('click', () => {
            this.pauseAnimation();
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        });

        yearSlider.addEventListener('input', (e) => {
            this.currentYear = parseInt(e.target.value);
            yearDisplay.textContent = this.currentYear;
            this.createTimeSeriesCharts(this.currentYear);
        });
    },

    /**
     * Start timeline animation
     */
    startAnimation: function() {
        this.isAnimating = true;
        this.currentYear = 2010;
        
        const interval = setInterval(() => {
            if (!this.isAnimating || this.currentYear >= 2024) {
                clearInterval(interval);
                this.isAnimating = false;
                document.getElementById('play-btn').style.display = 'inline-block';
                document.getElementById('pause-btn').style.display = 'none';
                return;
            }
            
            this.currentYear++;
            document.getElementById('year-slider').value = this.currentYear;
            document.getElementById('year-display').textContent = this.currentYear;
            this.createTimeSeriesCharts(this.currentYear);
        }, 500);
    },

    /**
     * Pause timeline animation
     */
    pauseAnimation: function() {
        this.isAnimating = false;
    },

    /**
     * Create time-series visualization charts
     */
    createTimeSeriesCharts: function(year) {
        this.createInternetTimeSeriesChart(year);
        this.createSpaceTimeSeriesChart(year);
    },

    /**
     * Create Internet adoption time-series chart
     */
    createInternetTimeSeriesChart: function(year) {
        d3.select('#timeseries-internet').selectAll('*').remove();
        
        const container = document.getElementById('timeseries-internet');
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = Math.max(container.offsetWidth - 40, 600) - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Prepare data: show top 15 countries
        const topCountriesInternet = DATA.countries
            .filter(c => c.internet > 0)
            .sort((a, b) => b.internet - a.internet)
            .slice(0, 15);

        const yearData = this.historicalData.find(d => d.year === year);
        const chartData = topCountriesInternet.map(c => ({
            ...c,
            internet: yearData[c.code]?.internet || c.internet
        }));

        const svg = d3.select('#timeseries-internet').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        d3.select('#timeseries-internet').insert('h3', 'svg')
            .attr('class', 'chart-title')
            .text(` Internet Adoption Trends (Top 15) - Year ${year}`);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleBand()
            .domain(chartData.map((d, i) => i))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Bars with animation
        g.selectAll('rect')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i))
            .attr('y', d => yScale(d.internet))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.internet))
            .attr('fill', '#4A90E2')
            .attr('stroke', '#2E5E8B')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#357ABD');
                const content = `
                    <div class="tooltip-title">${d.name} (${year})</div>
                    <div class="tooltip-line">Internet: ${d.internet.toFixed(1)}%</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#4A90E2');
                UTILS.hideTooltip();
            });

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(i => chartData[i].name.substring(0, 3))
            )
            .selectAll('text')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start')
            .style('font-size', '11px');

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
            .attr('fill', '#ffffff')
            .style('text-anchor', 'middle')
            .text('Internet Adoption (%)');
    },

    /**
     * Create Space objects time-series chart
     */
    createSpaceTimeSeriesChart: function(year) {
        d3.select('#timeseries-space').selectAll('*').remove();
        
        const container = document.getElementById('timeseries-space');
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = Math.max(container.offsetWidth - 40, 600) - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Prepare data: show top 15 countries by space
        const topCountriesSpace = DATA.countries
            .filter(c => c.space > 0)
            .sort((a, b) => b.space - a.space)
            .slice(0, 15);

        const yearData = this.historicalData.find(d => d.year === year);
        const chartData = topCountriesSpace.map(c => ({
            ...c,
            space: yearData[c.code]?.space || c.space
        }));

        const svg = d3.select('#timeseries-space').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        d3.select('#timeseries-space').insert('h3', 'svg')
            .attr('class', 'chart-title')
            .text(` Space Objects Trends (Top 15) - Year ${year}`);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleBand()
            .domain(chartData.map((d, i) => i))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.space)])
            .range([height, 0]);

        // Bars with animation
        g.selectAll('rect')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i))
            .attr('y', d => yScale(d.space))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.space))
            .attr('fill', '#E74C3C')
            .attr('stroke', '#C0392B')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#D43C2E');
                const content = `
                    <div class="tooltip-title">${d.name} (${year})</div>
                    <div class="tooltip-line">Objects: ${d.space}</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#E74C3C');
                UTILS.hideTooltip();
            });

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(i => chartData[i].name.substring(0, 3))
            )
            .selectAll('text')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start')
            .style('font-size', '11px');

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
            .attr('fill', '#ffffff')
            .style('text-anchor', 'middle')
            .text('Space Objects Launched');
    },

    /**
     * Setup multi-country comparison controls
     */
    setupComparisonControls: function() {
        const searchBox = document.getElementById('search-countries');
        const resetBtn = document.getElementById('reset-comparison');

        searchBox.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                this.showCountrySelector(query);
            } else {
                document.getElementById('country-selector').style.display = 'none';
            }
        });

        resetBtn.addEventListener('click', () => {
            this.selectedCountries = [];
            document.getElementById('search-countries').value = '';
            document.getElementById('country-selector').style.display = 'none';
            document.getElementById('comparison-panel').style.display = 'none';
            searchBox.focus();
        });
    },

    /**
     * Show country selector dropdown
     */
    showCountrySelector: function(query) {
        const filtered = DATA.countries.filter(c => 
            c.name.toLowerCase().includes(query)
        ).slice(0, 8);

        const selector = document.getElementById('country-selector');
        const list = document.getElementById('country-list');
        list.innerHTML = '';

        filtered.forEach(country => {
            const item = document.createElement('div');
            item.className = 'country-item';
            item.innerHTML = `<input type="checkbox" id="check-${country.code}" data-code="${country.code}" data-name="${country.name}">
                             <label for="check-${country.code}">${country.name}</label>`;
            
            const checkbox = item.querySelector('input');
            checkbox.checked = this.selectedCountries.some(c => c.code === country.code);
            
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    this.selectedCountries.push(country);
                } else {
                    this.selectedCountries = this.selectedCountries.filter(c => c.code !== country.code);
                }
                
                if (this.selectedCountries.length > 0) {
                    this.createComparisonView();
                }
            });
            
            list.appendChild(item);
        });

        selector.style.display = filtered.length > 0 ? 'block' : 'none';
    },

    /**
     * Create multi-country comparison view
     */
    createComparisonView: function() {
        if (this.selectedCountries.length === 0) return;

        const panel = document.getElementById('comparison-panel');
        const cardsContainer = document.getElementById('comparison-cards');
        
        panel.style.display = 'block';
        cardsContainer.innerHTML = '';

        // Create comparison cards
        this.selectedCountries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'comparison-card';
            
            const globals = INTERACTIONS.getGlobalStats();
            const internetRank = INTERACTIONS.calculateRankings(country.name, 'internet');
            const spaceRank = INTERACTIONS.calculateRankings(country.name, 'space');
            
            card.innerHTML = `
                <div class="comp-header">
                    <h4>${country.name}</h4>
                    <button class="comp-close" onclick="LEVEL4.removeCountryFromComparison('${country.code}')">✕</button>
                </div>
                <div class="comp-stat">
                    <span class="comp-label">Internet:</span>
                    <span class="comp-value">${country.internet.toFixed(1)}%</span>
                    <span class="comp-rank">#${internetRank.rank}</span>
                </div>
                <div class="comp-stat">
                    <span class="comp-label">Space Objects:</span>
                    <span class="comp-value">${country.space}</span>
                    <span class="comp-rank">#${spaceRank.rank}</span>
                </div>
                <div class="comp-stat">
                    <span class="comp-label">Internet vs Global:</span>
                    <span class="comp-diff" style="color: ${country.internet > globals.avgInternet ? '#27ae60' : '#e74c3c'};">
                        ${(country.internet - globals.avgInternet).toFixed(1)}pp
                    </span>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });

        // Create comparison chart
        this.createComparisonChart();
    },

    /**
     * Remove country from comparison
     */
    removeCountryFromComparison: function(code) {
        this.selectedCountries = this.selectedCountries.filter(c => c.code !== code);
        document.getElementById(`check-${code}`).checked = false;
        
        if (this.selectedCountries.length > 0) {
            this.createComparisonView();
        } else {
            document.getElementById('comparison-panel').style.display = 'none';
        }
    },

    /**
     * Create comparison chart visualization
     */
    createComparisonChart: function() {
        const container = document.getElementById('comparison-chart');
        container.innerHTML = '';
        
        const width = Math.max(container.offsetWidth - 40, 600);
        const height = 350;
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height);

        container.insertAdjacentHTML('afterbegin', '<h4 class="chart-title">📊 Comparison Chart</h4>');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Prepare data for grouped bars
        const metrics = ['internet', 'space'];
        const data = this.selectedCountries;

        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(metrics)
            .range(['#4A90E2', '#E74C3C']);

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, chartWidth])
            .padding(0.3);

        const subXScale = d3.scaleBand()
            .domain(metrics)
            .range([0, xScale.bandwidth()])
            .padding(0.05);

        const yMax = Math.max(
            d3.max(data, d => d.internet) || 0,
            d3.max(data, d => d.space) || 0
        );

        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([chartHeight, 0]);

        // Grouped bars
        data.forEach(country => {
            const x = xScale(country.name);

            // Internet bar
            g.append('rect')
                .attr('x', x + subXScale('internet'))
                .attr('y', yScale(country.internet))
                .attr('width', subXScale.bandwidth())
                .attr('height', chartHeight - yScale(country.internet))
                .attr('fill', '#4A90E2')
                .attr('stroke', '#2E5E8B')
                .on('mouseover', function(event) {
                    d3.select(this).attr('fill', '#357ABD');
                    const content = `<div class="tooltip-title">${country.name}</div><div class="tooltip-line">Internet: ${country.internet.toFixed(1)}%</div>`;
                    UTILS.showTooltip(event, content);
                })
                .on('mouseout', function() {
                    d3.select(this).attr('fill', '#4A90E2');
                    UTILS.hideTooltip();
                });

            // Space bar
            g.append('rect')
                .attr('x', x + subXScale('space'))
                .attr('y', yScale(country.space))
                .attr('width', subXScale.bandwidth())
                .attr('height', chartHeight - yScale(country.space))
                .attr('fill', '#E74C3C')
                .attr('stroke', '#C0392B')
                .on('mouseover', function(event) {
                    d3.select(this).attr('fill', '#D43C2E');
                    const content = `<div class="tooltip-title">${country.name}</div><div class="tooltip-line">Space: ${country.space}</div>`;
                    UTILS.showTooltip(event, content);
                })
                .on('mouseout', function() {
                    d3.select(this).attr('fill', '#E74C3C');
                    UTILS.hideTooltip();
                });
        });

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start')
            .style('font-size', '12px');

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale));

        // Legend
        const legendData = [
            {label: 'Internet Adoption (%)', color: '#4A90E2'},
            {label: 'Space Objects', color: '#E74C3C'}
        ];

        const legend = g.append('g')
            .attr('transform', `translate(${chartWidth - 200}, -15)`);

        legendData.forEach((item, i) => {
            const x = i * 180;
            legend.append('rect')
                .attr('x', x)
                .attr('y', 0)
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', item.color);

            legend.append('text')
                .attr('x', x + 20)
                .attr('y', 12)
                .style('font-size', '12px')
                .text(item.label);
        });
    }
};
