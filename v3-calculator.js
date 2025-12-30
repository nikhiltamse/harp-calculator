// HARP V3 Calculator - Enhanced with Parking Type Selection and Pricing

document.addEventListener('DOMContentLoaded', function() {
    initializeV3Calculator();
});

function initializeV3Calculator() {
    const parkingTypeRadios = document.querySelectorAll('input[name="parking-type"]');
    const pitDepthGroup = document.getElementById('pit-depth-group');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Handle parking type change
    parkingTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'pit') {
                pitDepthGroup.style.display = 'block';
            } else {
                pitDepthGroup.style.display = 'none';
                document.getElementById('pit-depth').value = '';
            }
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', function() {
        calculateCompatibleSystems();
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        resetCalculator();
    });
}

function calculateCompatibleSystems() {
    // Get parking type
    const parkingType = document.querySelector('input[name="parking-type"]:checked').value;
    
    // Get dimensions
    const height = parseInt(document.getElementById('height').value);
    const width = parseInt(document.getElementById('width').value);
    const length = parseInt(document.getElementById('length').value);
    const pitDepth = parkingType === 'pit' ? parseInt(document.getElementById('pit-depth').value) || 0 : 0;

    // Validate inputs
    if (!height || !width || !length) {
        alert('Please enter all required dimensions');
        return;
    }

    if (parkingType === 'pit' && !pitDepth) {
        alert('Please enter pit depth for pit parking');
        return;
    }

    // Find compatible systems
    const availableSpace = {
        height: height,
        width: width,
        length: length,
        pitDepth: pitDepth
    };

    const compatible = [];

    // Check all systems
    for (const [seriesKey, seriesData] of Object.entries(HARP_SPECIFICATIONS)) {
        for (const [modelId, spec] of Object.entries(seriesData)) {
            const compatibility = checkCompatibility(spec, availableSpace, modelId);
            
            if (compatibility.isCompatible) {
                // Filter by parking type
                const isPitSystem = modelId.startsWith('PP') || modelId.startsWith('PZ');
                
                if ((parkingType === 'pit' && isPitSystem) || 
                    (parkingType === 'above' && !isPitSystem)) {
                    compatible.push({
                        modelId: modelId,
                        spec: spec,
                        seriesKey: seriesKey,
                        compatibility: compatibility
                    });
                }
            }
        }
    }

    // Display results
    displayResults(compatible);
}

function checkCompatibility(spec, availableSpace, modelId) {
    const dimensions = spec.dimensions;
    const incompatibilityReasons = [];
    
    // Check height
    if (dimensions.requiredHeight > availableSpace.height) {
        incompatibilityReasons.push(`Height: Need ${dimensions.requiredHeight}mm, have ${availableSpace.height}mm`);
    }
    
    // Check width
    if (dimensions.requiredWidth > availableSpace.width) {
        incompatibilityReasons.push(`Width: Need ${dimensions.requiredWidth}mm, have ${availableSpace.width}mm`);
    }
    
    // Check length
    const requiredLength = dimensions.totalLength || dimensions.platformLength || 5000;
    if (requiredLength > availableSpace.length) {
        incompatibilityReasons.push(`Length: Need ${requiredLength}mm, have ${availableSpace.length}mm`);
    }
    
    // Check pit depth for pit systems
    if (dimensions.pitDepth && dimensions.pitDepth > availableSpace.pitDepth) {
        incompatibilityReasons.push(`Pit Depth: Need ${dimensions.pitDepth}mm, have ${availableSpace.pitDepth}mm`);
    }
    
    return {
        isCompatible: incompatibilityReasons.length === 0,
        reasons: incompatibilityReasons
    };
}

function displayResults(compatible) {
    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    const resultsList = document.getElementById('results-list');
    const resultsCount = document.getElementById('results-count');

    if (compatible.length === 0) {
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsCount.textContent = `${compatible.length} Compatible System${compatible.length > 1 ? 's' : ''} Found`;

    // Clear previous results
    resultsList.innerHTML = '';

    // Display each compatible system
    compatible.forEach(item => {
        const card = createModelCard(item);
        resultsList.appendChild(card);
    });

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createModelCard(item) {
    const { modelId, spec, seriesKey } = item;
    const dimensions = spec.dimensions;
    
    // Get placeholder price
    const price = getPlaceholderPrice(modelId);
    
    // Determine system type for diagram
    const systemType = getSystemType(modelId);
    const diagramMap = {
        'BOLT': 'assets/diagrams/bolt-series.jpg',
        'PITPRO': 'assets/diagrams/pitpro-series.jpg',
        'ELITE': 'assets/diagrams/bolt-series.jpg',
        'PUZZLE': 'assets/diagrams/pitpro-series.jpg'
    };
    const diagramPath = diagramMap[systemType];

    const card = document.createElement('div');
    card.className = 'model-card';
    
    card.innerHTML = `
        <div class="model-header">
            <div>
                <div class="model-name">${modelId} - ${spec.name}</div>
                <p style="color: #6b7280; margin: 0.5rem 0 0 0; font-size: 14px;">${spec.description || getSeriesDescription(seriesKey)}</p>
            </div>
            <div class="model-price">₹${price.toLocaleString('en-IN')}</div>
        </div>
        
        <div class="model-content">
            <div class="diagram-section">
                <h4 style="color: #374151; margin: 0 0 1rem 0; font-size: 14px; font-weight: 600;">System Diagram</h4>
                ${diagramPath ? `<img src="${diagramPath}" alt="${modelId} Diagram">` : '<p style="color: #9ca3af;">Diagram not available</p>'}
            </div>
            
            <div class="specs-section">
                <h4 style="color: #374151; margin: 0 0 1rem 0; font-size: 14px; font-weight: 600;">System Specifications</h4>
                <table>
                    <tbody>
                        <tr>
                            <td>Required Height (H)</td>
                            <td>${dimensions.requiredHeight}mm</td>
                        </tr>
                        <tr>
                            <td>Required Width (Q)</td>
                            <td>${dimensions.requiredWidth}mm</td>
                        </tr>
                        <tr>
                            <td>Total Length (L)</td>
                            <td>${dimensions.totalLength || dimensions.platformLength || 'N/A'}mm</td>
                        </tr>
                        ${dimensions.pitDepth ? `
                        <tr>
                            <td>Pit Depth (P)</td>
                            <td>${dimensions.pitDepth}mm</td>
                        </tr>
                        ` : ''}
                        ${spec.capacity ? `
                        <tr>
                            <td>Capacity</td>
                            <td>${spec.capacity} cars</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return card;
}

function getSystemType(modelId) {
    if (modelId.startsWith('BS')) return 'BOLT';
    if (modelId.startsWith('PP')) return 'PITPRO';
    if (modelId.startsWith('EL')) return 'ELITE';
    if (modelId.startsWith('PZ')) return 'PUZZLE';
    return 'BOLT';
}

function getSeriesDescription(seriesKey) {
    const descriptions = {
        'boltSeries': 'Double stacker parking system with 2 levels',
        'pitPro111': 'Three-level parking system with pit',
        'pitPro211': 'Multi-level pit parking with wider platform',
        'eliteSeries': 'Four-post heavy-duty stacker',
        'puzzleParking': 'Independent matrix parking system'
    };
    return descriptions[seriesKey] || 'Advanced parking system';
}

function getPlaceholderPrice(modelId) {
    // Placeholder pricing - will be replaced with actual prices
    const prices = {
        // Bolt Series
        'BS-32': 450000,
        'BS-33': 475000,
        'BS-34': 500000,
        'BS-35': 525000,
        'BS-36': 550000,
        'BS-37': 575000,
        'BS-38': 600000,
        
        // PitPro 111
        'PP111-01': 750000,
        'PP111-02': 775000,
        'PP111-03': 800000,
        'PP111-04': 825000,
        
        // PitPro 211
        'PP211-01': 850000,
        'PP211-02': 875000,
        'PP211-03': 900000,
        'PP211-04': 925000,
        
        // Elite Series
        'EL-32': 650000,
        'EL-33': 675000,
        
        // Puzzle Parking
        'PZ-24': 1200000,
        'PZ-26': 1250000,
        'PZ-28': 1300000,
        'PZ-210': 1400000
    };
    
    return prices[modelId] || 500000;
}

function resetCalculator() {
    document.getElementById('above-ground').checked = true;
    document.getElementById('pit-depth-group').style.display = 'none';
    document.getElementById('height').value = '';
    document.getElementById('width').value = '';
    document.getElementById('length').value = '';
    document.getElementById('pit-depth').value = '';
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('no-results').style.display = 'none';
}
