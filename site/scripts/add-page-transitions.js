const fs = require('fs');
const path = require('path');

const pagesToUpdate = [
  'gallery.js',
  'guestbook.js',
  'map.js',
  'photobooth.js',
  'timeline.js',
  'upload.js',
  'venue.js',
];

const pagesDir = path.join(__dirname, '../pages');

pagesToUpdate.forEach((pageFile) => {
  const filePath = path.join(pagesDir, pageFile);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already properly imported
  if (content.includes("import PageTransition from '../components/PageTransition'")) {
    console.log(`✓ ${pageFile} already has PageTransition import`);
  } else {
    // Find the last component import line
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import') && lines[i].includes("from '../components/")) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      // Insert the import after the last component import
      lines.splice(
        lastImportIndex + 1,
        0,
        "import PageTransition from '../components/PageTransition';"
      );
      content = lines.join('\n');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Added PageTransition import to ${pageFile}`);
    } else {
      console.log(`✗ Could not find component imports in ${pageFile}`);
    }
  }
});

console.log('\n✨ All imports added!');
