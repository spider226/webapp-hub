const sharp = require('sharp');
const path = require('path');

const assets = path.join(__dirname, '..', 'assets');
const svgs = ['icon-192.svg', 'icon-512.svg'];

(async () => {
  for (const svg of svgs) {
    const png = svg.replace('.svg', '.png');
    await sharp(path.join(assets, svg)).png().toFile(path.join(assets, png));
    console.log(`Generated ${png}`);
  }
})();
