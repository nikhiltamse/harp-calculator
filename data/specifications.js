// HARP Parking System Specifications
// Data extracted from HARP Catalogue Standard V4.pdf

const HARP_SPECIFICATIONS = {
  // Bolt Series - Double Stacker (2 levels)
  boltSeries: {
    'BS-32': {
      name: 'Sedan + Sedan',
      carHeights: { entry: 1500, upper: 1500 },
      dimensions: { requiredHeight: 3200, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-33': {
      name: 'HB + Sedan',
      carHeights: { entry: 1600, upper: 1500 },
      dimensions: { requiredHeight: 3300, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-34': {
      name: 'TB + Sedan',
      carHeights: { entry: 1700, upper: 1500 },
      dimensions: { requiredHeight: 3400, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-35': {
      name: 'TB + Sedan',
      carHeights: { entry: 1800, upper: 1500 },
      dimensions: { requiredHeight: 3500, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-36': {
      name: 'TB + Sedan',
      carHeights: { entry: 1900, upper: 1500 },
      dimensions: { requiredHeight: 3600, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-37': {
      name: 'SUV + Sedan',
      carHeights: { entry: 2000, upper: 1500 },
      dimensions: { requiredHeight: 3700, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-38': {
      name: 'SUV + HB',
      carHeights: { entry: 2000, upper: 1600 },
      dimensions: { requiredHeight: 3800, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-39': {
      name: 'SUV + TB',
      carHeights: { entry: 2000, upper: 1700 },
      dimensions: { requiredHeight: 3900, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-40': {
      name: 'SUV + TB',
      carHeights: { entry: 2000, upper: 1800 },
      dimensions: { requiredHeight: 4000, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-41': {
      name: 'SUV + TB',
      carHeights: { entry: 2000, upper: 1900 },
      dimensions: { requiredHeight: 4100, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'BS-42': {
      name: 'SUV + SUV',
      carHeights: { entry: 2000, upper: 2000 },
      dimensions: { requiredHeight: 4200, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    }
  },

  // PitPro-111 Series - 3 Levels (Top, Ground, Pit)
  pitPro111: {
    'PP111-01': {
      name: 'Sedan + Sedan + Sedan',
      carHeights: { top: 1550, ground: 1550, pit: 1550 },
      dimensions: { requiredHeight: 3600, pitDepth: 1800, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'PP111-02': {
      name: 'Sedan + Sedan + Compact SUV',
      carHeights: { top: 1550, ground: 1550, pit: 1650 },
      dimensions: { requiredHeight: 3600, pitDepth: 1900, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'PP111-03': {
      name: 'Sedan + Compact SUV + Sedan',
      carHeights: { top: 1550, ground: 1650, pit: 1550 },
      dimensions: { requiredHeight: 3700, pitDepth: 1800, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'PP111-04': {
      name: 'Compact SUV + Sedan + Sedan',
      carHeights: { top: 1650, ground: 1550, pit: 1550 },
      dimensions: { requiredHeight: 3700, pitDepth: 1800, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'PP111-05': {
      name: 'Compact SUV + Compact SUV + Compact SUV',
      carHeights: { top: 1650, ground: 1650, pit: 1650 },
      dimensions: { requiredHeight: 3800, pitDepth: 1900, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    },
    'PP111-06': {
      name: 'SUV + Sedan + Sedan',
      carHeights: { top: 1800, ground: 1550, pit: 1550 },
      dimensions: { requiredHeight: 3850, pitDepth: 1800, requiredWidth: 2400, platformLength: 5000, totalLength: 5300 }
    }
  },

  // PitPro-211 Series - Multi-level Pit System
  pitPro211: {
    'PP211-01': {
      name: 'Standard Configuration',
      carHeights: { entry: 1550, lower: 1550 },
      dimensions: { requiredHeight: 3600, pitDepth: 1800, requiredWidth: 2700, platformLength: 5000, totalLength: 5300 }
    },
    'PP211-02': {
      name: 'SUV Configuration',
      carHeights: { entry: 1800, lower: 1800 },
      dimensions: { requiredHeight: 3850, pitDepth: 2050, requiredWidth: 2700, platformLength: 5000, totalLength: 5300 }
    }
  },

  // Elite Series - Four Post Stacker
  eliteSeries: {
    'EL-01': {
      name: 'Sedan + Sedan',
      carHeights: { entry: 1550, upper: 1550 },
      dimensions: { requiredHeight: 3700, requiredWidth: 2500, platformLength: 5100, totalLength: 5400 }
    },
    'EL-02': {
      name: 'SUV + SUV',
      carHeights: { entry: 1800, upper: 1800 },
      dimensions: { requiredHeight: 4200, requiredWidth: 2500, platformLength: 5100, totalLength: 5400 }
    }
  },

  // Puzzle Parking - Matrix System
  puzzleParking: {
    'PZ-2x3': {
      name: '2 Rows x 3 Columns',
      configuration: { rows: 2, columns: 3, levels: 1 },
      carHeight: 1550,
      dimensions: { requiredHeight: 2000, requiredWidth: 7500, requiredLength: 10500 }
    },
    'PZ-2x4': {
      name: '2 Rows x 4 Columns',
      configuration: { rows: 2, columns: 4, levels: 1 },
      carHeight: 1550,
      dimensions: { requiredHeight: 2000, requiredWidth: 10000, requiredLength: 10500 }
    },
    'PZ-3x3': {
      name: '3 Rows x 3 Columns',
      configuration: { rows: 3, columns: 3, levels: 1 },
      carHeight: 1550,
      dimensions: { requiredHeight: 2000, requiredWidth: 7500, requiredLength: 15500 }
    }
  }
};

// Helper function to get all models for a series
function getSeriesModels(seriesName) {
  return HARP_SPECIFICATIONS[seriesName] || {};
}

// Helper function to calculate dimensions based on custom inputs
function calculateCustomDimensions(series, model, inputs) {
  const spec = HARP_SPECIFICATIONS[series]?.[model];
  if (!spec) return null;

  // For custom calculations, we'll use the base dimensions
  // and adjust based on user inputs if they differ from defaults
  return {
    ...spec.dimensions,
    model: model,
    name: spec.name
  };
}

// Export for use in main calculator
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HARP_SPECIFICATIONS, getSeriesModels, calculateCustomDimensions };
}
