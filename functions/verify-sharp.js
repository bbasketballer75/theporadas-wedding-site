const fs = require('fs');

const sharp = require('sharp');

(async () => {
  try {
    // Create a 100x100 red PNG in memory
    const img = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    // Resize to 50x50
    const resized = await sharp(img).resize(50, 50).png().toBuffer();

    fs.writeFileSync('functions/verify-sharp-output.png', resized);
    console.log('OK: sharp resize succeeded, output: functions/verify-sharp-output.png');

    // Require firebase-admin to ensure it resolves
    require('firebase-admin');
    console.log('OK: firebase-admin require succeeded');

    process.exit(0);
  } catch (err) {
    console.error('ERROR during verification:', err);
    process.exit(2);
  }
})();
