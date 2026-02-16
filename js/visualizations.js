/**
 * D3 Visualization Functions
 */

const VIZ = {
    /**
     * Create Internet Usage Distribution Chart
     */
    createInternetDistribution: function(data) {
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Prepare data for histogram
        const bins = d3.bin()
            .domain([0, 100])
            .thresholds(15)
            (data.map(d => d.internet));

        const svg = d3.select('#internet-dist').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        // Add title
        d3.select('#internet-dist').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('🌐 Internet Usage Distribution');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);

        // Bars
        g.selectAll('.bar')
            .data(bins)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(d.length))
            .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
            .attr('height', d => height - yScale(d.length))
            .on('mouseover', function(event, d) {
                d3.select(this).attr('opacity', 0.8);
                const content = `
                    <div class="tooltip-title">Range</div>
                    <div class="tooltip-line">${UTILS.formatNumber(d.x0)}% - ${UTILS.formatNumber(d.x1)}%</div>
                    <div class="tooltip-line">Countries: ${d.length}</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 0.7);
                UTILS.hideTooltip();
            });

        // X Axis
        g.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', 'var(--neutral-dark)')
            .style('text-anchor', 'middle')
            .style('font-size', '0.95rem')
            .text('Internet Usage (%)');

        // Y Axis
        g.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .attr('fill', 'var(--neutral-dark)')
            .style('text-anchor', 'middle')
            .style('font-size', '0.95rem')
            .text('Number of Countries');

        // Grid lines
        g.append('g')
            .attr('class', 'grid-line')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat('')
            );
    },

    /**
     * Create Space Objects Distribution Chart
     */
    createSpaceDistribution: function(data) {
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Filter countries with space launches
        const spaceData = data.filter(d => d.space > 0).sort((a, b) => b.space - a.space).slice(0, 25);

        const svg = d3.select('#space-dist').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        // Add title
        d3.select('#space-dist').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('🚀 Space Objects Launched (Top 25)');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(spaceData, d => d.space)])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(spaceData.map(d => d.name))
            .range([height, 0])
            .padding(0.3);

        // Bars
        g.selectAll('.bar')
            .data(spaceData)
            .enter()
            .append('rect')
            .attr('class', 'bar space')
            .attr('y', d => yScale(d.name))
            .attr('height', yScale.bandwidth())
            .attr('width', d => xScale(d.space))
            .on('mouseover', function(event, d) {
                d3.select(this).attr('opacity', 0.8);
                const content = `
                    <div class="tooltip-title">${d.name}</div>
                    <div class="tooltip-line">Objects: ${d.space}</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 0.7);
                UTILS.hideTooltip();
            });

        // X Axis
        g.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', 'var(--neutral-dark)')
            .style('text-anchor', 'middle')
            .style('font-size', '0.95rem')
            .text('Number of Objects Launched');

        // Y Axis (hide labels for brevity, show on hover)
        g.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale).tickSize(0))
            .selectAll('text')
            .style('font-size', '0.75rem');

        // Grid lines
        g.append('g')
            .attr('class', 'grid-line')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat('')
            );
    },

    /**
     * Create Scatter Plot - Correlation between Internet and Space
     */
    createScatterPlot: function(data) {
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 1300 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        // Filter countries with space launches for better visualization
        const plotData = data.filter(d => d.internet !== null && d.space !== null);

        const svg = d3.select('#scatter-plot').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        // Add title
        d3.select('#scatter-plot').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('📊 Correlation: Internet Adoption vs Space Technology Capability');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(plotData, d => d.space)])
            .range([height, 0]);

        // Grid lines
        g.append('g')
            .attr('class', 'grid-line')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
            );

        g.append('g')
            .attr('class', 'grid-line')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat('')
            );

        // Add dots
        g.selectAll('.dot')
            .data(plotData)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.internet))
            .attr('cy', d => yScale(d.space))
            .attr('r', 5)
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 8);
                const content = `
                    <div class="tooltip-title">${d.name}</div>
                    <div class="tooltip-line">Internet: ${UTILS.formatNumber(d.internet)}%</div>
                    <div class="tooltip-line">Objects: ${d.space}</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 5);
                UTILS.hideTooltip();
            });

        // X Axis
        g.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', 'var(--neutral-dark)')
            .style('text-anchor', 'middle')
            .style('font-size', '0.95rem')
            .text('Internet Usage (%)');

        // Y Axis
        g.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .attr('fill', 'var(--neutral-dark)')
            .style('text-anchor', 'middle')
            .style('font-size', '0.95rem')
            .text('Objects Launched');
    },

    /**
     * Create Choropleth Map - Internet Usage
     */
    createInternetMap: function(geoData) {
        const width = 600;
        const height = 500;

        const svg = d3.select('#internet-map').append('svg')
            .attr('width', width)
            .attr('height', height);

        // Add title
        d3.select('#internet-map').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('🗺️ Internet Usage by Country');

        // Projection and path
        const projection = d3.geoMercator()
            .fitSize([width, height], geoData);

        const pathGenerator = d3.geoPath()
            .projection(projection);

        // Color scale for internet
        const internetValues = geoData.features
            .map(f => f.properties.internet)
            .filter(v => v !== undefined && v !== null);

        const colorScale = UTILS.getColorScale(internetValues, ['#f7fbff', '#08519c']);

        // Draw countries
        svg.selectAll('.country')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('class', d => {
                if (d.properties.internet === undefined) return 'country no-data';
                return 'country internet';
            })
            .attr('d', pathGenerator)
            .attr('fill', d => {
                if (d.properties.internet === undefined) return '#f5f5f5';
                return colorScale(d.properties.internet);
            })
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .style('stroke-width', '2px')
                    .style('stroke', '#333');

                if (d.properties.internet !== undefined) {
                    const content = `
                        <div class="tooltip-title">${d.properties.name || 'Unknown'}</div>
                        <div class="tooltip-line">Internet: ${UTILS.formatNumber(d.properties.internet)}%</div>
                    `;
                    UTILS.showTooltip(event, content);
                }
            })
            .on('mouseout', function() {
                d3.select(this)
                    .style('stroke-width', '0.5px')
                    .style('stroke', 'white');
                UTILS.hideTooltip();
            });

        // Add legend
        const legendDiv = d3.select('#internet-map')
            .append('div')
            .html(UTILS.createLegend(colorScale, 'Internet Usage (%)', d => d.toFixed(0) + '%'));
    },

    /**
     * Create Choropleth Map - Space Objects
     */
    createSpaceMap: function(geoData) {
        const width = 600;
        const height = 500;

        const svg = d3.select('#space-map').append('svg')
            .attr('width', width)
            .attr('height', height);

        // Add title
        d3.select('#space-map').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('🚀 Space Objects Launched by Country');

        // Projection and path
        const projection = d3.geoMercator()
            .fitSize([width, height], geoData);

        const pathGenerator = d3.geoPath()
            .projection(projection);

        // Color scale for space objects
        const spaceValues = geoData.features
            .map(f => f.properties.space)
            .filter(v => v !== undefined && v !== null && v > 0);

        const colorScale = d3.scaleSymlog()
            .domain([0, d3.max(spaceValues)])
            .range(['#fff5f0', '#d62728']);

        // Draw countries
        svg.selectAll('.country')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('class', d => {
                if (d.properties.space === undefined || d.properties.space === 0) return 'country no-data';
                return 'country space';
            })
            .attr('d', pathGenerator)
            .attr('fill', d => {
                if (d.properties.space === undefined || d.properties.space === 0) return '#f5f5f5';
                return colorScale(d.properties.space);
            })
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .style('stroke-width', '2px')
                    .style('stroke', '#333');

                if (d.properties.space > 0) {
                    const content = `
                        <div class="tooltip-title">${d.properties.name || 'Unknown'}</div>
                        <div class="tooltip-line">Objects: ${d.properties.space}</div>
                    `;
                    UTILS.showTooltip(event, content);
                }
            })
            .on('mouseout', function() {
                d3.select(this)
                    .style('stroke-width', '0.5px')
                    .style('stroke', 'white');
                UTILS.hideTooltip();
            });

        // Add legend
        const legendDiv = d3.select('#space-map')
            .append('div')
            .html(UTILS.createLegend(colorScale, 'Objects Launched', d => Math.round(d)));
    }
};
