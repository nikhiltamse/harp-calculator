// HARP Parking System Recommendation Calculator

document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('space-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        findCompatibleSystems();
    });
}

function findCompatibleSystems() {
    // Get user inputs
    const availableSpace = {
        height: parseInt(document.getElementById('height').value),
        width: parseInt(document.getElementById('width').value),
        length: parseInt(document.getElementById('length').value),
        pitDepth: parseInt(document.getElementById('pit-depth').value) || 0
    };

    // Validate inputs
    if (!availableSpace.height || !availableSpace.width || !availableSpace.length) {
        showError('Please fill in all required fields (Height, Width, Length)');
        return;
    }

    hideError();

    // Find compatible and incompatible systems
    const compatible = [];
    const incompatible = [];

    // Check all systems
    for (const [seriesKey, models] of Object.entries(HARP_SPECIFICATIONS)) {
        for (const [modelId, spec] of Object.entries(models)) {
            const result = checkCompatibility(spec, availableSpace, seriesKey, modelId);

            if (result.compatible) {
                compatible.push(result);
            } else {
                incompatible.push(result);
            }
        }
    }

    // Sort compatible by fit score (best first)
    compatible.sort((a, b) => b.fitScore - a.fitScore);

    // Display results
    displayResults(compatible, incompatible, availableSpace);
}

function checkCompatibility(spec, availableSpace, seriesKey, modelId) {
    const reasons = [];
    let compatible = true;

    // Check height
    if (spec.dimensions.requiredHeight > availableSpace.height) {
        compatible = false;
        reasons.push(`Height: Need ${spec.dimensions.requiredHeight}mm, have ${availableSpace.height}mm (short by ${spec.dimensions.requiredHeight - availableSpace.height}mm)`);
    }

    // Check width
    if (spec.dimensions.requiredWidth > availableSpace.width) {
        compatible = false;
        reasons.push(`Width: Need ${spec.dimensions.requiredWidth}mm, have ${availableSpace.width}mm (short by ${spec.dimensions.requiredWidth - availableSpace.width}mm)`);
    }

    // Check length
    if (spec.dimensions.totalLength > availableSpace.length) {
        compatible = false;
        reasons.push(`Length: Need ${spec.dimensions.totalLength}mm, have ${availableSpace.length}mm (short by ${spec.dimensions.totalLength - availableSpace.length}mm)`);
    }

    // Check pit depth (if system requires it)
    if (spec.dimensions.pitDepth && spec.dimensions.pitDepth > 0) {
        if (availableSpace.pitDepth === 0) {
            compatible = false;
            reasons.push(`Pit Required: This system needs ${spec.dimensions.pitDepth}mm pit depth (no pit available)`);
        } else if (spec.dimensions.pitDepth > availableSpace.pitDepth) {
            compatible = false;
            reasons.push(`Pit Depth: Need ${spec.dimensions.pitDepth}mm, have ${availableSpace.pitDepth}mm (short by ${spec.dimensions.pitDepth - availableSpace.pitDepth}mm)`);
        }
    }

    // Calculate fit score (space utilization)
    const fitScore = compatible ? calculateFitScore(spec, availableSpace) : 0;

    return {
        seriesKey,
        modelId,
        spec,
        compatible,
        reasons,
        fitScore
    };
}

function calculateFitScore(spec, availableSpace) {
    // Calculate how well the system fits the space (0-100)
    const heightUtil = (spec.dimensions.requiredHeight / availableSpace.height) * 100;
    const widthUtil = (spec.dimensions.requiredWidth / availableSpace.width) * 100;
    const lengthUtil = (spec.dimensions.totalLength / availableSpace.length) * 100;

    // Average utilization
    let avgUtil = (heightUtil + widthUtil + lengthUtil) / 3;

    // Bonus for pit systems if pit is available
    if (spec.dimensions.pitDepth && availableSpace.pitDepth > 0) {
        const pitUtil = (spec.dimensions.pitDepth / availableSpace.pitDepth) * 100;
        avgUtil = (avgUtil * 3 + pitUtil) / 4;
    }

    // Prefer 85-95% utilization (not too tight, not too wasteful)
    if (avgUtil >= 85 && avgUtil <= 95) {
        return avgUtil + 5; // Bonus for optimal fit
    }

    return Math.min(avgUtil, 100);
}

function displayResults(compatible, incompatible, availableSpace) {
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    const compatibleDiv = document.getElementById('compatible-systems');
    const incompatibleDiv = document.getElementById('incompatible-systems');

    // Clear previous results
    compatibleDiv.innerHTML = '';
    incompatibleDiv.innerHTML = '';

    // Show results count
    resultsCount.textContent = `${compatible.length} compatible system${compatible.length !== 1 ? 's' : ''} found`;

    // Group compatible systems by series
    const groupedCompatible = groupBySeries(compatible);

    // Display compatible systems
    if (compatible.length > 0) {
        for (const [seriesName, systems] of Object.entries(groupedCompatible)) {
            const seriesCard = createSeriesCard(seriesName, systems, availableSpace, true);
            compatibleDiv.appendChild(seriesCard);
        }
    } else {
        compatibleDiv.innerHTML = '<div class="no-results">No compatible systems found for the given space. Try increasing the dimensions.</div>';
    }

    // Display incompatible systems (collapsed by default)
    if (incompatible.length > 0) {
        const groupedIncompatible = groupBySeries(incompatible);
        const incompatibleSection = document.createElement('div');
        incompatibleSection.className = 'incompatible-section';
        incompatibleSection.innerHTML = `
            <h3 class="incompatible-title" onclick="toggleIncompatible()">
                ❌ Incompatible Systems (${incompatible.length})
                <span class="toggle-icon">▼</span>
            </h3>
            <div class="incompatible-content" id="incompatible-content" style="display: none;">
            </div>
        `;

        const incompatibleContent = incompatibleSection.querySelector('.incompatible-content');
        for (const [seriesName, systems] of Object.entries(groupedIncompatible)) {
            const seriesCard = createSeriesCard(seriesName, systems, availableSpace, false);
            incompatibleContent.appendChild(seriesCard);
        }

        incompatibleDiv.appendChild(incompatibleSection);
    }

    // Show results
    resultsContainer.classList.add('show');

    // Scroll to results
    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function groupBySeries(systems) {
    const grouped = {};
    const seriesNames = {
        'boltSeries': 'Bolt Series',
        'pitPro111': 'PitPro-111',
        'pitPro211': 'PitPro-211',
        'eliteSeries': 'Elite Series',
        'puzzleParking': 'Puzzle Parking'
    };

    for (const system of systems) {
        const seriesName = seriesNames[system.seriesKey] || system.seriesKey;
        if (!grouped[seriesName]) {
            grouped[seriesName] = [];
        }
        grouped[seriesName].push(system);
    }

    return grouped;
}

function createSeriesCard(seriesName, systems, availableSpace, isCompatible) {
    const card = document.createElement('div');
    card.className = `series-card ${isCompatible ? 'compatible' : 'incompatible'}`;

    const icon = isCompatible ? '✅' : '❌';
    const count = systems.length;

    let html = `
        <div class="series-header">
            <h3>${icon} ${seriesName}</h3>
            <span class="system-count">${count} system${count !== 1 ? 's' : ''}</span>
        </div>
        <div class="systems-list">
    `;

    for (const system of systems) {
        html += createSystemCard(system, availableSpace, isCompatible);
    }

    html += '</div>';
    card.innerHTML = html;

    return card;
}

function createSystemCard(system, availableSpace, isCompatible) {
    const { modelId, spec, fitScore, reasons } = system;

    let html = `<div class="system-card ${isCompatible ? 'compatible-card' : 'incompatible-card'}">`;

    // Header
    html += `
        <div class="system-header">
            <div class="system-name">${modelId} - ${spec.name}</div>
            ${isCompatible ? `<div class="fit-score">${getFitScoreBadge(fitScore)}</div>` : ''}
        </div>
    `;

    // Dimensions comparison
    html += '<div class="dimensions-comparison">';

    html += createDimensionRow('Height', spec.dimensions.requiredHeight, availableSpace.height);
    html += createDimensionRow('Width', spec.dimensions.requiredWidth, availableSpace.width);
    html += createDimensionRow('Length', spec.dimensions.totalLength, availableSpace.length);

    if (spec.dimensions.pitDepth) {
        html += createDimensionRow('Pit Depth', spec.dimensions.pitDepth, availableSpace.pitDepth);
    }

    html += '</div>';

    // Show reasons if incompatible
    if (!isCompatible && reasons.length > 0) {
        html += '<div class="incompatible-reasons">';
        for (const reason of reasons) {
            html += `<div class="reason">⚠️ ${reason}</div>`;
        }
        html += '</div>';
    }

    html += '</div>';

    return html;
}

function createDimensionRow(label, required, available) {
    const fits = required <= available;
    const difference = available - required;
    const icon = fits ? '✓' : '✗';
    const statusClass = fits ? 'fits' : 'no-fit';

    return `
        <div class="dimension-row ${statusClass}">
            <span class="dim-icon">${icon}</span>
            <span class="dim-label">${label}:</span>
            <span class="dim-required">${required}mm</span>
            <span class="dim-available">(Available: ${available}mm)</span>
            <span class="dim-diff">${difference >= 0 ? '+' : ''}${difference}mm</span>
        </div>
    `;
}

function getFitScoreBadge(score) {
    let stars = '';
    let label = '';

    if (score >= 95) {
        stars = '⭐⭐⭐⭐⭐';
        label = 'Perfect Fit';
    } else if (score >= 85) {
        stars = '⭐⭐⭐⭐';
        label = 'Excellent';
    } else if (score >= 75) {
        stars = '⭐⭐⭐';
        label = 'Good';
    } else if (score >= 60) {
        stars = '⭐⭐';
        label = 'Fair';
    } else {
        stars = '⭐';
        label = 'Poor Fit';
    }

    return `<span class="fit-badge">${stars} ${label} (${Math.round(score)}%)</span>`;
}

function toggleIncompatible() {
    const content = document.getElementById('incompatible-content');
    const icon = document.querySelector('.toggle-icon');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}

function resetForm() {
    document.getElementById('space-form').reset();
    document.getElementById('results-container').classList.remove('show');
    hideError();
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.add('show');

    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.classList.remove('show');
}
