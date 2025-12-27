// Diagram display for HARP Systems using official catalogue images

function generateSystemDiagram(spec, dimensions, modelId) {
    const container = document.getElementById('diagram-container');

    // Determine system type
    const systemType = getSystemType(modelId);

    // Map to diagram image
    const diagramMap = {
        'BOLT': 'assets/diagrams/bolt-series.jpg',
        'PITPRO': 'assets/diagrams/pitpro-series.jpg',
        'ELITE': 'assets/diagrams/bolt-series.jpg', // Elite uses similar structure to Bolt
        'PUZZLE': 'assets/diagrams/pitpro-series.jpg' // Placeholder until we get puzzle diagram
    };

    const imagePath = diagramMap[systemType] || null;

    if (imagePath) {
        container.innerHTML = `
            <img src="${imagePath}" 
                 alt="${systemType} System Diagram" 
                 class="diagram-image"
                 style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #1e40af;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                    <strong>Key Dimensions:</strong> 
                    Height: <span style="color: #1e40af; font-weight: 600;">${dimensions.requiredHeight}mm</span> | 
                    Width: <span style="color: #1e40af; font-weight: 600;">${dimensions.requiredWidth}mm</span> | 
                    Length: <span style="color: #1e40af; font-weight: 600;">${dimensions.totalLength}mm</span>
                    ${dimensions.pitDepth ? ` | Pit: <span style="color: #f97316; font-weight: 600;">${dimensions.pitDepth}mm</span>` : ''}
                </p>
            </div>
        `;
    } else {
        // Fallback if no diagram available
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #f9fafb; border-radius: 8px; border: 2px dashed #d1d5db;">
                <p style="color: #6b7280; font-size: 16px; margin: 0;">
                    ≡ƒôÉ Technical diagram for ${modelId}
                </p>
                <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; display: inline-block;">
                    <p style="margin: 8px 0; color: #374151;"><strong>Height:</strong> ${dimensions.requiredHeight}mm</p>
                    <p style="margin: 8px 0; color: #374151;"><strong>Width:</strong> ${dimensions.requiredWidth}mm</p>
                    <p style="margin: 8px 0; color: #374151;"><strong>Length:</strong> ${dimensions.totalLength}mm</p>
                    ${dimensions.pitDepth ? `<p style="margin: 8px 0; color: #f97316;"><strong>Pit Depth:</strong> ${dimensions.pitDepth}mm</p>` : ''}
                </div>
            </div>
        `;
    }
}

function getSystemType(modelId) {
    if (modelId.startsWith('BS')) return 'BOLT';
    if (modelId.startsWith('PP')) return 'PITPRO';
    if (modelId.startsWith('EL')) return 'ELITE';
    if (modelId.startsWith('PZ')) return 'PUZZLE';
    return 'GENERIC';
}
