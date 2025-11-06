// Template Test Script
// Run this in the browser console on the designer page to test each template

const windowTemplates = [
  'single', 'double', 'triple', 'sliding', 'fixed', 'casement',
  'tilt_turn', 'awning', 'hopper', 'bay', 'bow', 'arch', 'picture',
  'jalousie', 'transom', 'skylight', 'corner', 'garden', 'storm',
  'clerestory', 'greenhouse'
];

const doorTemplates = [
  'single', 'double', 'sliding', 'bifold', 'pivot', 'french',
  'entry', 'patio', 'barn', 'pocket', 'accordion', 'security',
  'sliding_panel', 'louvre'
];

// Test function
async function testTemplate(type, template) {
  console.log(`Testing ${type}: ${template}...`);
  
  // Find the update function (this would need to be adapted based on your actual component structure)
  // For now, we'll just log what needs to be tested
  
  return {
    type,
    template,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
}

// Test all templates
async function testAllTemplates() {
  const results = [];
  
  console.log('=== Testing Window Templates ===');
  for (const template of windowTemplates) {
    const result = await testTemplate('window', template);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('=== Testing Door Templates ===');
  for (const template of doorTemplates) {
    const result = await testTemplate('door', template);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('=== Test Results ===');
  console.table(results);
  return results;
}

// Export for use
if (typeof window !== 'undefined') {
  window.testAllTemplates = testAllTemplates;
  window.windowTemplates = windowTemplates;
  window.doorTemplates = doorTemplates;
  console.log('Test functions loaded. Run testAllTemplates() to start testing.');
}





