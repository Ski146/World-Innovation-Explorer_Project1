/**
 * D3 Visualization Functions
 */

const VIZ = {
    /**
     * Create Internet Usage Distribution Chart
     */
    createInternetDistribution: function(data) {
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 380 - margin.top - margin.bottom;

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
            .text('Internet Usage Distribution');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);

        // Bars - Using blue color
        g.selectAll('.bar')
            .data(bins)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(d.length))
            .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
            .attr('height', d => height - yScale(d.length))
            .attr('fill', '#4A90E2')
            .attr('stroke', '#2E5E8B')
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#357ABD');
                const content = `
                    <div class="tooltip-title">Internet: ${d.x0.toFixed(0)}% - ${d.x1.toFixed(0)}%</div>
                    <div class="tooltip-line">Countries: ${d.length}</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#4A90E2');
                UTILS.hideTooltip();
            })
            .on('click', function(event, d) {
                if (d.length > 0) {
                    const country = d[0].name ? d[0] : DATA.countries.find(c => c.internet >= d.x0 && c.internet < d.x1);
                    if (country) INTERACTIONS.selectCountry(country.name, country.internet, country.space, country.code);
                }
            });

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', '#ffffff')
            .style('text-anchor', 'middle')
            .text('Internet Usage (%)');

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
            .text('Number of Countries');
    },

    /**
     * Create Space Objects Distribution Chart
     */
    createSpaceDistribution: function(data) {
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 380 - margin.top - margin.bottom;

        // Get top 20 countries by space objects
        const topCountries = data
            .filter(d => d.space > 0)
            .sort((a, b) => b.space - a.space)
            .slice(0, 20);

        const svg = d3.select('#space-dist').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        // Add title
        d3.select('#space-dist').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('Top 20 Countries - Space Objects');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleBand()
            .domain(topCountries.map((d, i) => i))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(topCountries, d => d.space)])
            .range([height, 0]);

        // Bars - Using red color
        g.selectAll('.bar')
            .data(topCountries)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale(i))
            .attr('y', d => yScale(d.space))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.space))
            .attr('fill', '#E74C3C')
            .attr('stroke', '#C0392B')
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#D43C2E');
                const content = `
                    <div class="tooltip-title">${d.name}</div>
                    <div class="tooltip-line">Objects: ${d.space}</div>
                    <div class="tooltip-line">Click for details</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#E74C3C');
                UTILS.hideTooltip();
            })
            .on('click', function(event, d) {
                INTERACTIONS.selectCountry(d.name, d.internet, d.space, d.code);
            });

        // X Axis (country names)
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(i => topCountries[i].name)
            )
            .selectAll('text')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start')
            .style('font-size', '12px');

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
            .text('Objects Launched');
    },

    /**
     * Create Scatter Plot - Internet vs Space Objects
     */
    createScatterPlot: function(data) {
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 1500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select('#scatter-plot').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        // Add title
        d3.select('#scatter-plot').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('Internet Usage vs Space Objects Correlation');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.space)])
            .range([height, 0]);

        // Dots - Using blue color
        g.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.internet))
            .attr('cy', d => yScale(d.space))
            .attr('r', 4)
            .attr('fill', '#4A90E2')
            .attr('stroke', '#2E5E8B')
            .attr('opacity', 0.7)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('r', 7)
                    .attr('fill', '#357ABD');
                const content = `
                    <div class="tooltip-title">${d.name}</div>
                    <div class="tooltip-line">Internet: ${UTILS.formatNumber(d.internet)}%</div>
                    <div class="tooltip-line">Objects: ${d.space}</div>
                `;
                UTILS.showTooltip(event, content);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('r', 4)
                    .attr('fill', '#4A90E2');
                UTILS.hideTooltip();
            })
            .on('click', function(event, d) {
                INTERACTIONS.selectCountry(d.name, d.internet, d.space, d.code);
            });

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', '#ffffff')
            .style('text-anchor', 'middle')
            .text('Internet Usage (%)');

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
     * Create Choropleth Map - Internet Usage
     */
    createInternetMap: function(geoData) {
        console.log('Creating Internet map with', geoData.features.length, 'features');
        
        const container = document.getElementById('internet-map');
        if (!container) {
            console.error('Internet map container not found');
            return;
        }
        
        const width = Math.max(container.offsetWidth - 40, 900);
        const height = 600;
        
        console.log('Internet map dimensions:', width, 'x', height);

        const svg = d3.select('#internet-map').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#F5F5F5')
            .style('border', '1px solid #ddd')
            .style('display', 'block');

        // Add title
        d3.select('#internet-map').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('Internet Usage by Country');

        // Projection and path
        const projection = d3.geoMercator()
            .fitSize([width - 20, height - 20], geoData)
            .translate([(width - 20) / 2, (height - 20) / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        // Color scale for internet - Blue gradient (#4A90E2)
        const internetValues = geoData.features
            .map(f => f.properties.internet)
            .filter(v => v !== undefined && v !== null && v > 0);

        if (internetValues.length === 0) {
            console.warn('No internet data found in GeoJSON features');
        }

        const minInternetValue = Math.min(...internetValues) || 0;
        const meanInternetValue = d3.mean(internetValues) || 50;
        const maxInternetValue = Math.max(...internetValues) || 100;

        const colorScale = d3.scaleLinear()
            .domain([minInternetValue, meanInternetValue, maxInternetValue])
            .range(['#E3F2FD', '#4A90E2', '#1A4D8F']);

        // Create group for paths
        const g = svg.append('g');

        // Draw countries
        let pathCount = 0;
        g.selectAll('path')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('fill', d => {
                if (d.properties.internet === undefined || d.properties.internet === null) {
                    return '#F0F0F0';
                }
                pathCount++;
                return colorScale(d.properties.internet);
            })
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', '0.75px')
            .style('cursor', 'pointer')
            .style('transition', 'all 0.2s ease')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', '#333')
                    .style('filter', 'brightness(1.1)');

                if (d.properties.internet !== undefined && d.properties.internet !== null) {
                    const content = `
                        <div class="tooltip-title">${d.properties.name || 'Unknown'}</div>
                        <div class="tooltip-line">Internet: ${UTILS.formatNumber(d.properties.internet)}%</div>
                    `;
                    UTILS.showTooltip(event, content);
                }
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('stroke-width', '0.75px')
                    .attr('stroke', '#FFFFFF')
                    .style('filter', 'brightness(1)');
                UTILS.hideTooltip();
            })
            .on('click', function(event, d) {
                if (d.properties.internet !== undefined && d.properties.internet !== null) {
                    INTERACTIONS.selectCountry(
                        d.properties.name || 'Unknown',
                        d.properties.internet || 0,
                        d.properties.space || 0,
                        d.properties.id || ''
                    );
                }
            });

        console.log('Internet map: Created', pathCount, 'paths with data');

        // Add legend
        const legendHtml = `
            <div class="legend" style="margin-top: 1rem; padding: 0.5rem; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #ffffff;">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 14px;">Internet Usage (%)</strong>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: 20px; background-color: #E3F2FD; border: 1px solid #999;"></div>
                        <span style="font-size: 12px;">${Math.round(minInternetValue)}%</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: 20px; background-color: #4A90E2; border: 1px solid #999;"></div>
                        <span style="font-size: 12px;">${Math.round(meanInternetValue)}%</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: 20px; background-color: #1A4D8F; border: 1px solid #999;"></div>
                        <span style="font-size: 12px;">${Math.round(maxInternetValue)}%</span>
                    </div>
                </div>
            </div>
        `;
        
        //d3.select('#internet-map').append('div').html(legendHtml);
    },

    /**
     * Create Choropleth Map - Space Object   */
   createSpaceMap: function(geoData) {
        console.log('Creating Space map with', geoData.features.length, 'features');
        
        const container = document.getElementById('space-map');
        if (!container) {
            console.error('Space map container not found');
            return;
        }
        
        const width = Math.max(container.offsetWidth - 40, 900);
        const height = 600;
        
        console.log('Space map dimensions:', width, 'x', height);

        const svg = d3.select('#space-map').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#F5F5F5')
            .style('border', '1px solid #ddd')
            .style('display', 'block');

        // Add title
        d3.select('#space-map').insert('h2', 'svg')
            .attr('class', 'chart-title')
            .text('Space Objects Launched by Country');

        // Projection and path
        const projection = d3.geoMercator()
            .fitSize([width - 20, height - 20], geoData)
            .translate([(width - 20) / 2, (height - 20) / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        
        const spaceValues = geoData.features
            .map(f => f.properties.space)
            .filter(v => v !== undefined && v !== null && v > 0);

        if (spaceValues.length === 0) {
            console.warn('No space data found in GeoJSON features');
        }

        const colorScale = d3.scaleSymlog()
            .domain([1, d3.max(spaceValues) || 100])
            .range(['#FFEBEE', '#E74C3C']);

        // Create group for paths
        const g = svg.append('g');

        // Draw countries
        let pathCount = 0;
        g.selectAll('path')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('fill', d => {
                if (d.properties.space === undefined || d.properties.space === null || d.properties.space === 0) {
                    return '#F0F0F0';
                }
                pathCount++;
                return colorScale(d.properties.space);
            })
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', '0.75px')
            .style('cursor', 'pointer')
            .style('transition', 'all 0.2s ease')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', '#333')
                    .style('filter', 'brightness(1.1)');

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
                    .attr('stroke-width', '0.75px')
                    .attr('stroke', '#FFFFFF')
                    .style('filter', 'brightness(1)');
                UTILS.hideTooltip();
            })
            .on('click', function(event, d) {
                if (d.properties.space > 0) {
                    INTERACTIONS.selectCountry(
                        d.properties.name || 'Unknown',
                        d.properties.internet || 0,
                        d.properties.space || 0,
                        d.properties.id || ''
                    );
                }
            });

        console.log('Space map: Created', pathCount, 'paths with data');

                // Add legend
        const maxSpaceValue = d3.max(spaceValues) || 100;
        const legendHtml = `
            <div class="legend" style="margin-top: 1rem; padding: 0.5rem; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #ffffff;">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 14px;">Objects Launched</strong>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: 20px; background-color: #FFEBEE; border: 1px solid #999;"></div>
                        <span style="font-size: 12px;">Low</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 20px; height: 20px; background-color: #E74C3C; border: 1px solid #999;"></div>
                        <span style="font-size: 12px;">High (${Math.round(maxSpaceValue)})</span>
                    </div>
                </div>
            </div>
        `; 
        
        //d3.select('#space-map').append('div').html(legendHtml);
    }
};
