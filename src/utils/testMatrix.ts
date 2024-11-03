import type { DeviceTest } from '../types';

export const TEST_DEVICES: Record<string, DeviceTest[]> = {
  mobile: [
    { name: 'iPhone 12/13', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'OnePlus 6T', width: 402, height: 858 },
    { name: 'Google Pixel 5', width: 393, height: 851 },
    { name: 'iPad', width: 768, height: 1024 }
  ],
  desktop: [
    { name: 'Large Desktop', width: 1920, height: 1080 },
    { name: 'Medium Desktop', width: 1440, height: 900 },
    { name: 'Small Desktop', width: 1366, height: 768 }
  ]
};

export const TEST_SCENARIOS = [
  {
    name: 'Initial Load',
    steps: [
      'Check header visibility',
      'Verify input area display',
      'Confirm button visibility'
    ]
  },
  {
    name: 'Content Entry',
    steps: [
      'Test URL input',
      'Verify category selection',
      'Check button state changes'
    ]
  },
  {
    name: 'Results Display',
    steps: [
      'Monitor progress bar',
      'Check results grid layout',
      'Verify scroll behavior'
    ]
  }
];