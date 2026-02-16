# World Innovation Explorer

A data visualization project exploring the relationship between internet adoption and space technology capability across countries.

## Project Overview

This interactive web application visualizes two key indicators of technological innovation:
- **Internet Usage**: Share of the population using the internet (%)
- **Space Technology**: Number of objects launched into outer space by country

## Theme: Innovation & Technological Change

This project demonstrates how innovation manifests across different dimensions of technology, from basic internet connectivity to advanced space capabilities.

## Data Sources

- **Internet Usage Data**: [Our World in Data - Share of Individuals Using the Internet](https://ourworldindata.org/grapher/share-of-individuals-using-the-internet)
  - Source: World Telecommunication/ICT Indicators Database - International Telecommunication Union (ITU)
  - Year: 2023 (latest available data)

- **Space Objects Data**: [Our World in Data - Annual Objects Launched into Outer Space](https://ourworldindata.org/grapher/yearly-number-of-objects-launched-into-outer-space)
  - Source: United Nations Office for Outer Space Affairs (UNOOSA)
  - Year: 2023 (latest available data)

## Project Structure

```
world-innovation-explorer/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling (modern, responsive design)
├── js/
│   ├── main.js            # Application entry point
│   ├── data.js            # Country data and constants
│   ├── visualizations.js  # D3 visualization functions
│   └── utils.js           # Utility functions for data and display
├── data/
│   └── (generated dynamically from js/data.js)
└── README.md              # This file
```

## Visualizations Included (Level 1 & 2)

### Level 1: Distributions and Correlation
1. **Internet Usage Distribution**: Histogram showing the distribution of internet penetration across countries
2. **Space Objects Distribution**: Bar chart of top 25 countries by number of space objects launched
3. **Correlation Scatter Plot**: Relationship between internet adoption and space capabilities

### Level 2: Spatial Distribution
4. **Internet Usage Choropleth Map**: World map colored by internet usage percentage
5. **Space Objects Choropleth Map**: World map colored by number of space objects launched

## Features

- **Modern, Aesthetic Design**: Clean dashboard layout with gradient header and consistent color palette
- **Interactive Elements**: Hover over any visualization element to see detailed tooltips
- **Responsive Layout**: Works on different screen sizes
- **Professional Color Schemes**: 
  - Internet: Blue gradient (#4A90E2 to darker blue)
  - Space: Red gradient (#E74C3C to darker red)
  - Neutral backgrounds and careful color usage

## Color Rationale

- **Internet (Blue)**: Represents connectivity and digital networks
- **Space (Red)**: Represents exploration and technological frontier
- **Neutral Grays**: Used for backgrounds to minimize distraction
- **Gradients**: Used for choropleth maps following ColorBrewer principles

## How to Use

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. Explore the visualizations:
   - Hover over bars, dots, and map regions for detailed information
   - Observe patterns and correlations in the data
   - Notice which countries lead in each metric

## Key Findings

- Countries with high internet penetration tend to have launched more space objects
- Advanced economies dominate both metrics
- Internet adoption is more widespread than space capabilities
- Several countries appear as leaders in only one metric

## Technologies Used

- **D3.js v7**: For all data visualizations
- **TopoJSON v3**: For geographic data
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Application logic

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Level Requirements Met

✅ **Level 1:**
- Title, name, and data source attribution
- 2 quantitative measures selected (Internet %, Space objects)
- CSV files from Our World in Data
- 2 distribution visualizations (histograms/bar charts)
- 1 correlation visualization (scatter plot)

✅ **Level 2:**
- 2 choropleth maps (side-by-side)
- World GeoJSON integration
- Thoughtful color scheme choices using ColorBrewer principles
- Intentional dashboard layout designed for comparison
- No scrolling required for related visualizations

## Future Enhancements

- Level 3: Add more data attributes with selection dropdowns
- Level 4: More detailed hover information
- Level 5: Brushing and linking interactions between visualizations
- Time-varying data: Animation through years if temporal data is included
- Deployment on Vercel or similar platform

## Notes

- Application assumes a minimum viewport width of ~1400px for optimal experience
- GeoJSON data is loaded from GitHub CDN
- No external dependencies beyond D3.js and TopoJSON
