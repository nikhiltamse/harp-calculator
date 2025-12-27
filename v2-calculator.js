// HARP Version 2 Calculator - Forward Lookup (Product ΓåÆ Dimensions)

document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if we're on V2 page
    if (document.getElementById('series-select')) {
        initializeV2Calculator();
    }
});

function initializeV2Calculator() {
    const seriesSelect = document.getElementById('series-select');
    const modelSelect = document.getElementById('model-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const dimensionInputs = document.getElementById('dimension-inputs');
    const carHeightGroup = document.getElementById('car-height-group');

    // Series selection handler
    seriesSelect.addEventListener('change', function () {
        const series = this.value;

        if (!series) {
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="">Select series first...</option>';
            calculateBtn.disabled = true;
            dimensionInputs.style.display = 'none';
            return;
        }

        // Populate models for selected series
        populateModels(series);
        modelSelect.disabled = false;
        dimensionInputs.style.display = 'block';

        // Show/hide car height input based on series
        if (series === 'puzzleParking') {
            carHeightGroup.style.display = 'block';
        } else {
            carHeightGroup.style.display = 'none';
        }
    });

    // Model selection handler
    modelSelect.addEventListener('change', function () {
        calculateBtn.disabled = !this.value;
    });

    // Calculate button handler
    calculateBtn.addEventListener('click', function () {
        calculateDimensions();
    });

    // Reset button handler
    resetBtn.addEventListener('click', function () {
        resetCalculator();
    });
}

function populateModels(seriesKey) {
    const modelSelect = document.getElementById('model-select');
    const models = HARP_SPECIFICATIONS[seriesKey];

    if (!models) {
        modelSelect.innerHTML = '<option value="">No models available</option>';
        return;
    }

    let html = '<option value="">Select model...</option>';

    for (const [modelId, spec] of Object.entries(models)) {
        html += `<option value="${modelId}">${modelId} - ${spec.name}</option>`;
    }

    modelSelect.innerHTML = html;
}

function calculateDimensions() {
    const seriesKey = document.getElementById('series-select').value;
    const modelId = document.getElementById('model-select').value;
    const carLength = parseInt(document.getElementById('car-length').value) || 5000;
    const carHeight = parseInt(document.getElementById('car-height').value) || 1550;

    if (!seriesKey || !modelId) {
        return;
    }

    const spec = HARP_SPECIFICATIONS[seriesKey][modelId];

    if (!spec) {
        return;
    }

    // Calculate dimensions based on car size
    const dimensions = {
        ...spec.dimensions,
        carLength: carLength,
        carHeight: carHeight,
        // Calculate total length if needed
        totalLength: spec.dimensions.totalLength || (carLength + (spec.dimensions.platformBuffer || 300))
    };

    // Display results
    displayDimensionResults(spec, dimensions, modelId);
}

function displayDimensionResults(spec, dimensions, modelId) {
    const resultsPanel = document.getElementById('results-panel');
    const systemTitle = document.getElementById('system-title');
    const systemDescription = document.getElementById('system-description');

    // Show results panel
    resultsPanel.style.display = 'flex';

    // Update system info
    systemTitle.textContent = `${modelId} - ${spec.name}`;
    systemDescription.textContent = spec.description || getSeriesDescription(spec);

    // Populate dimension tables
    populateHeightTable(dimensions);
    populateWidthTable(dimensions);
    populateLengthTable(dimensions);
    populateAdditionalSpecs(spec, dimensions);

    // Generate and display diagram
    if (typeof generateSystemDiagram === 'function') {
        generateSystemDiagram(spec, dimensions, modelId);
    }

    // Scroll to results
    setTimeout(() => {
        resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function populateHeightTable(dimensions) {
    const tbody = document.getElementById('height-table');

    let html = '';

    if (dimensions.lowerCarHeight) {
        html += createTableRow('Lower Car Height (X)', dimensions.lowerCarHeight);
    }

    if (dimensions.upperCarHeight) {
        html += createTableRow('Upper Car Height (Y)', dimensions.upperCarHeight);
    }

    if (dimensions.entryCarHeight) {
        html += createTableRow('Entry Car Height (H1)', dimensions.entryCarHeight);
    }

    html += createTableRow('Required Height (H)', dimensions.requiredHeight, true);

    if (dimensions.pitDepth) {
        html += createTableRow('Pit Depth (P)', dimensions.pitDepth);
    }

    tbody.innerHTML = html;
}

function populateWidthTable(dimensions) {
    const tbody = document.getElementById('width-table');

    let html = '';

    if (dimensions.platformWidth) {
        html += createTableRow('Platform Width', dimensions.platformWidth);
    }

    html += createTableRow('Required Width (W)', dimensions.requiredWidth, true);

    if (dimensions.bayWidth) {
        html += createTableRow('Bay Width', dimensions.bayWidth);
    }

    tbody.innerHTML = html;
}

function populateLengthTable(dimensions) {
    const tbody = document.getElementById('length-table');

    let html = '';

    html += createTableRow('Car Length (L)', dimensions.carLength);

    if (dimensions.platformLength) {
        html += createTableRow('Platform Length (L2)', dimensions.platformLength);
    }

    html += createTableRow('Total Length (L1)', dimensions.totalLength, true);

    tbody.innerHTML = html;
}

function populateAdditionalSpecs(spec, dimensions) {
    const tbody = document.getElementById('specs-table');

    let html = '';

    if (spec.carTypes) {
        html += createTableRow('Car Types', spec.carTypes.join(' + '));
    }

    if (spec.levels) {
        html += createTableRow('Levels', spec.levels);
    }

    if (spec.capacity) {
        html += createTableRow('Capacity', `${spec.capacity} cars`);
    }

    if (dimensions.clearance) {
        html += createTableRow('Clearance', `${dimensions.clearance}mm`);
    }

    tbody.innerHTML = html;
}

function createTableRow(label, value, highlight = false) {
    const rowClass = highlight ? ' class="highlight"' : '';
    const displayValue = typeof value === 'number' ? `${value}mm` : value;

    return `
        <tr${rowClass}>
            <td>${label}</td>
            <td>${displayValue}</td>
        </tr>
    `;
}

function getSeriesDescription(spec) {
    const descriptions = {
        'BS': 'Double stacker parking system with 2 levels (ground + upper platform). Ideal for residential and commercial applications.',
        'PP111': 'Three-level parking system (top + ground + pit). Maximizes space utilization with underground parking.',
        'PP211': 'Multi-level pit parking system with wider platform configuration for larger vehicles.',
        'EL': 'Four-post heavy-duty stacker for premium vehicles and higher weight capacity.',
        'PZ': 'Independent matrix system where cars move horizontally and vertically for high-density parking.'
    };

    // Try to match series prefix
    for (const [prefix, desc] of Object.entries(descriptions)) {
        if (spec.name && spec.name.startsWith(prefix)) {
            return desc;
        }
    }

    return 'Advanced parking system designed for optimal space utilization.';
}

function resetCalculator() {
    document.getElementById('series-select').value = '';
    document.getElementById('model-select').value = '';
    document.getElementById('model-select').disabled = true;
    document.getElementById('model-select').innerHTML = '<option value="">Select series first...</option>';
    document.getElementById('car-length').value = '5000';
    document.getElementById('car-height').value = '1550';
    document.getElementById('calculate-btn').disabled = true;
    document.getElementById('dimension-inputs').style.display = 'none';
    document.getElementById('results-panel').style.display = 'none';
}
