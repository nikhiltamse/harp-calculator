// HARP Parking System Calculator - Main Logic

// Tab Switching
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    initializeForms();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(`${tabId}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Hide results when switching tabs
            hideResults();
        });
    });
}

function initializeForms() {
    // Bolt Series Form
    document.getElementById('bolt-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculateBoltSeries();
    });

    // PitPro-111 Form
    document.getElementById('pitpro111-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculatePitPro111();
    });

    // PitPro-211 Form
    document.getElementById('pitpro211-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculatePitPro211();
    });

    // Elite Series Form
    document.getElementById('elite-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculateEliteSeries();
    });

    // Puzzle Parking Form
    document.getElementById('puzzle-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculatePuzzleParking();
    });
}

// Calculation Functions
function calculateBoltSeries() {
    const modelSelect = document.getElementById('bolt-model');
    const carLength = parseInt(document.getElementById('bolt-car-length').value);

    if (!modelSelect.value) {
        showError('Please select a model configuration');
        return;
    }

    if (!carLength || carLength < 3000 || carLength > 6000) {
        showError('Please enter a valid car length between 3000mm and 6000mm');
        return;
    }

    const model = modelSelect.value;
    const spec = HARP_SPECIFICATIONS.boltSeries[model];

    if (!spec) {
        showError('Model specification not found');
        return;
    }

    // Calculate adjusted dimensions based on car length
    const lengthAdjustment = carLength - 5000; // Base length is 5000mm
    const totalLength = spec.dimensions.totalLength + lengthAdjustment;

    const results = {
        'Model': `${model} - ${spec.name}`,
        'Required Height (H)': `${spec.dimensions.requiredHeight} mm`,
        'Required Width (W)': `${spec.dimensions.requiredWidth} mm`,
        'Platform Length (L2)': `${spec.dimensions.platformLength + lengthAdjustment} mm`,
        'Total Length (L1)': `${totalLength} mm`,
        'Entry Car Height': `${spec.carHeights.entry} mm`,
        'Upper Car Height': `${spec.carHeights.upper} mm`
    };

    displayResults(results);
}

function calculatePitPro111() {
    const modelSelect = document.getElementById('pitpro111-model');
    const carLength = parseInt(document.getElementById('pitpro111-car-length').value);

    if (!modelSelect.value) {
        showError('Please select a model configuration');
        return;
    }

    if (!carLength || carLength < 3000 || carLength > 6000) {
        showError('Please enter a valid car length between 3000mm and 6000mm');
        return;
    }

    const model = modelSelect.value;
    const spec = HARP_SPECIFICATIONS.pitPro111[model];

    if (!spec) {
        showError('Model specification not found');
        return;
    }

    const lengthAdjustment = carLength - 5000;
    const totalLength = spec.dimensions.totalLength + lengthAdjustment;

    const results = {
        'Model': `${model} - ${spec.name}`,
        'Required Height (H)': `${spec.dimensions.requiredHeight} mm`,
        'Pit Depth (P)': `${spec.dimensions.pitDepth} mm`,
        'Required Width (W)': `${spec.dimensions.requiredWidth} mm`,
        'Platform Length (L2)': `${spec.dimensions.platformLength + lengthAdjustment} mm`,
        'Total Length (L1)': `${totalLength} mm`,
        'Top Car Height': `${spec.carHeights.top} mm`,
        'Ground Car Height': `${spec.carHeights.ground} mm`,
        'Pit Car Height': `${spec.carHeights.pit} mm`
    };

    displayResults(results);
}

function calculatePitPro211() {
    const modelSelect = document.getElementById('pitpro211-model');
    const carLength = parseInt(document.getElementById('pitpro211-car-length').value);

    if (!modelSelect.value) {
        showError('Please select a model configuration');
        return;
    }

    if (!carLength || carLength < 3000 || carLength > 6000) {
        showError('Please enter a valid car length between 3000mm and 6000mm');
        return;
    }

    const model = modelSelect.value;
    const spec = HARP_SPECIFICATIONS.pitPro211[model];

    if (!spec) {
        showError('Model specification not found');
        return;
    }

    const lengthAdjustment = carLength - 5000;
    const totalLength = spec.dimensions.totalLength + lengthAdjustment;

    const results = {
        'Model': `${model} - ${spec.name}`,
        'Required Height (H)': `${spec.dimensions.requiredHeight} mm`,
        'Pit Depth (P)': `${spec.dimensions.pitDepth} mm`,
        'Required Width (W)': `${spec.dimensions.requiredWidth} mm`,
        'Platform Length (L2)': `${spec.dimensions.platformLength + lengthAdjustment} mm`,
        'Total Length (L1)': `${totalLength} mm`,
        'Entry Car Height': `${spec.carHeights.entry} mm`,
        'Lower Car Height': `${spec.carHeights.lower} mm`
    };

    displayResults(results);
}

function calculateEliteSeries() {
    const modelSelect = document.getElementById('elite-model');
    const carLength = parseInt(document.getElementById('elite-car-length').value);

    if (!modelSelect.value) {
        showError('Please select a model configuration');
        return;
    }

    if (!carLength || carLength < 3000 || carLength > 6000) {
        showError('Please enter a valid car length between 3000mm and 6000mm');
        return;
    }

    const model = modelSelect.value;
    const spec = HARP_SPECIFICATIONS.eliteSeries[model];

    if (!spec) {
        showError('Model specification not found');
        return;
    }

    const lengthAdjustment = carLength - 5000;
    const totalLength = spec.dimensions.totalLength + lengthAdjustment;

    const results = {
        'Model': `${model} - ${spec.name}`,
        'Required Height (H)': `${spec.dimensions.requiredHeight} mm`,
        'Required Width (W)': `${spec.dimensions.requiredWidth} mm`,
        'Platform Length (L2)': `${spec.dimensions.platformLength + lengthAdjustment} mm`,
        'Total Length (L1)': `${totalLength} mm`,
        'Entry Car Height': `${spec.carHeights.entry} mm`,
        'Upper Car Height': `${spec.carHeights.upper} mm`
    };

    displayResults(results);
}

function calculatePuzzleParking() {
    const modelSelect = document.getElementById('puzzle-model');
    const carHeight = parseInt(document.getElementById('puzzle-car-height').value);

    if (!modelSelect.value) {
        showError('Please select a configuration');
        return;
    }

    if (!carHeight || carHeight < 1400 || carHeight > 2000) {
        showError('Please enter a valid car height between 1400mm and 2000mm');
        return;
    }

    const model = modelSelect.value;
    const spec = HARP_SPECIFICATIONS.puzzleParking[model];

    if (!spec) {
        showError('Model specification not found');
        return;
    }

    // Height adjustment based on car height
    const heightAdjustment = carHeight - 1550; // Base height is 1550mm
    const requiredHeight = spec.dimensions.requiredHeight + heightAdjustment;

    const results = {
        'Configuration': `${spec.name}`,
        'Total Capacity': `${spec.configuration.rows * spec.configuration.columns} cars`,
        'Required Height (H)': `${requiredHeight} mm`,
        'Required Width (W)': `${spec.dimensions.requiredWidth} mm`,
        'Required Length (L)': `${spec.dimensions.requiredLength} mm`,
        'Rows': spec.configuration.rows,
        'Columns': spec.configuration.columns,
        'Max Car Height': `${carHeight} mm`
    };

    displayResults(results);
}

// Display Functions
function displayResults(results) {
    hideError();

    const resultsSection = document.getElementById('results');
    const resultsGrid = document.getElementById('results-grid');

    // Clear previous results
    resultsGrid.innerHTML = '';

    // Create result items
    for (const [label, value] of Object.entries(results)) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        const resultLabel = document.createElement('div');
        resultLabel.className = 'result-label';
        resultLabel.textContent = label;

        const resultValue = document.createElement('div');
        resultValue.className = 'result-value';

        // Check if value contains units (mm)
        if (typeof value === 'string' && value.includes('mm')) {
            const parts = value.split(' ');
            resultValue.innerHTML = `${parts[0]}<span class="result-unit">${parts[1]}</span>`;
        } else {
            resultValue.textContent = value;
        }

        resultItem.appendChild(resultLabel);
        resultItem.appendChild(resultValue);
        resultsGrid.appendChild(resultItem);
    }

    // Show results with animation
    resultsSection.classList.add('show');

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function hideResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('show');
}

// Error Handling
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.classList.remove('show');
}

// Reset Functions
function resetForm(series) {
    // Hide results and errors
    hideResults();
    hideError();

    // Reset the form
    const form = document.getElementById(`${series}-form`);
    if (form) {
        form.reset();
    }
}

// Utility Functions
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

function convertToMeters(mm) {
    return (mm / 1000).toFixed(2);
}
