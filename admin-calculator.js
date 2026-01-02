// HARP Admin Portal - Manufacturing Cost vs Quoted Price Analysis

document.addEventListener('DOMContentLoaded', function () {
    initializeAdminPortal();
});

function initializeAdminPortal() {
    const parkingTypeRadios = document.querySelectorAll('input[name="parking-type"]');
    const pitDepthGroup = document.getElementById('pit-depth-group');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Handle parking type change
    parkingTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'pit') {
                pitDepthGroup.style.display = 'block';
            } else {
                pitDepthGroup.style.display = 'none';
                document.getElementById('pit-depth').value = '';
            }
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', function () {
        calculateCompatibleSystems();
    });

    // Reset button
    resetBtn.addEventListener('click', function () {
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

    // Check height - EXACT MATCH REQUIRED
    if (dimensions.requiredHeight !== availableSpace.height) {
        incompatibilityReasons.push(`Height mismatch: System needs ${dimensions.requiredHeight}mm, you entered ${availableSpace.height}mm`);
    }

    // Check width - EXACT MATCH REQUIRED
    if (dimensions.requiredWidth !== availableSpace.width) {
        incompatibilityReasons.push(`Width mismatch: System needs ${dimensions.requiredWidth}mm, you entered ${availableSpace.width}mm`);
    }

    // Length check removed - user input length is always valid

    // Check pit depth for pit systems - EXACT MATCH REQUIRED
    if (dimensions.pitDepth && dimensions.pitDepth !== availableSpace.pitDepth) {
        incompatibilityReasons.push(`Pit Depth mismatch: System needs ${dimensions.pitDepth}mm, you entered ${availableSpace.pitDepth}mm`);
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
    resultsCount.textContent = `${compatible.length} Compatible System${compatible.length > 1 ? 's' : ''} - Cost Analysis`;

    // Clear previous results
    resultsList.innerHTML = '';

    // Get parking type to determine which diagram to show
    const parkingType = document.querySelector('input[name="parking-type"]:checked').value;
    const diagramPath = parkingType === 'pit' ? 'assets/diagrams/pitpro-series.jpg' : 'assets/diagrams/bolt-series.jpg';

    // Create results layout: diagram on left, systems list on right (responsive)
    const resultsLayout = document.createElement('div');
    resultsLayout.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 1rem;';
    resultsLayout.className = 'results-layout-responsive';

    // Add responsive style
    if (!document.getElementById('responsive-styles')) {
        const style = document.createElement('style');
        style.id = 'responsive-styles';
        style.textContent = `
            @media (min-width: 768px) {
                .results-layout-responsive {
                    grid-template-columns: 1fr 1fr !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Left: Single diagram
    const diagramSection = document.createElement('div');
    diagramSection.innerHTML = `
        <h3 style="color: #374151; margin: 0 0 1rem 0; font-size: 16px; font-weight: 600;">System Diagram</h3>
        <img src="${diagramPath}" alt="System Diagram" style="width: 100%; border: 1px solid #e5e7eb; border-radius: 4px;">
    `;

    // Right: Systems list
    const systemsList = document.createElement('div');
    systemsList.innerHTML = `
        <h3 style="color: #374151; margin: 0 0 1rem 0; font-size: 16px; font-weight: 600;">Compatible Systems</h3>
        <div id="systems-table"></div>
    `;

    resultsLayout.appendChild(diagramSection);
    resultsLayout.appendChild(systemsList);
    resultsList.appendChild(resultsLayout);

    // Add each system as a row
    const systemsTable = document.getElementById('systems-table');
    compatible.forEach(item => {
        const row = createSystemRow(item);
        systemsTable.appendChild(row);
    });

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createSystemRow(item) {
    const { modelId, spec } = item;
    const dimensions = spec.dimensions;

    // Get prices
    const quotedPrice = getQuotedPrice(modelId);
    const manufacturingCost = getManufacturingCost(quotedPrice);
    const profit = quotedPrice - manufacturingCost;
    const profitPercent = ((profit / quotedPrice) * 100).toFixed(1);

    const row = document.createElement('div');
    row.style.cssText = 'padding: 1.25rem; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem; background: white;';

    row.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <div style="font-size: 18px; font-weight: 700; color: #dc2626;">${modelId} - ${spec.name}</div>
        </div>
        
        <!-- Price Comparison -->
        <div class="price-comparison">
            <div class="price-item">
                <div class="price-label">Manufacturing Cost</div>
                <div class="price-value cost">₹${manufacturingCost.toLocaleString('en-IN')}</div>
            </div>
            <div class="price-item">
                <div class="price-label">Quoted Price</div>
                <div class="price-value quoted">₹${quotedPrice.toLocaleString('en-IN')}</div>
            </div>
            <div class="price-item">
                <div class="price-label">Profit</div>
                <div class="price-value profit">₹${profit.toLocaleString('en-IN')}</div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 0.25rem;">(${profitPercent}%)</div>
            </div>
        </div>
        
        <!-- Specifications -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 14px; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
            <div>
                <span style="color: #6b7280;">Height (H):</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">${dimensions.requiredHeight}mm</span>
            </div>
            <div>
                <span style="color: #6b7280;">Width Range (Q):</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">2250-2750mm</span>
            </div>
            <div>
                <span style="color: #6b7280;">Length (L):</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">${dimensions.totalLength || dimensions.platformLength || 'N/A'}mm</span>
            </div>
            ${dimensions.pitDepth ? `
            <div>
                <span style="color: #6b7280;">Pit (P):</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">${dimensions.pitDepth}mm</span>
            </div>
            ` : ''}
            ${spec.carHeights && spec.carHeights.entry ? `
            <div>
                <span style="color: #6b7280;">Lower Car Height (X):</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">${spec.carHeights.entry}mm</span>
            </div>
            ` : ''}
            ${spec.carHeights && spec.carHeights.upper ? `
            <div>
                <span style="color: #6b7280;">Upper Car Height (Y):</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">${spec.carHeights.upper}mm</span>
            </div>
            ` : ''}
            ${spec.capacity ? `
            <div>
                <span style="color: #6b7280;">Capacity:</span>
                <span style="font-weight: 600; color: #111827; margin-left: 0.5rem;">${spec.capacity} cars</span>
            </div>
            ` : ''}
        </div>
    `;

    return row;
}

function getQuotedPrice(modelId) {
    // Same prices as V3 (quoted by sales team)
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

function getManufacturingCost(quotedPrice) {
    // Manufacturing cost is 20k-25k less than quoted price
    const reduction = 20000 + Math.random() * 5000; // Random between 20k-25k
    return Math.round(quotedPrice - reduction);
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
