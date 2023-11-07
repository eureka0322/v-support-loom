// Adapted from https://raw.githubusercontent.com/mugi-uno/parcel-plugin-bundle-manifest/master/plugins/BundleManifestPlugin.js

/* eslint @typescript-eslint/no-var-requires: 0 */

const path = require('path');
const fs = require('fs');

module.exports = function (bundler) {
  bundler.on('bundled', (bundle) => {
    const dir = path.join(__dirname, '..', '..', 'private');
    const manifestPath = path.resolve(dir, 'manifest.json');
    const manifestValue = entryPointHandler(bundle);
    fs.writeFileSync(manifestPath, JSON.stringify(manifestValue, null, 2));
  });

  function entryPointHandler(bundle) {
    const publicURL = bundler.options.publicURL;
    const manifestValue = {};
    if (
      bundle.entryAsset &&
      bundle.entryAsset.relativeName === 'manifest.html'
    ) {
      if (
        bundle.entryAsset &&
        bundle.entryAsset.generated &&
        bundle.entryAsset.generated.html
      ) {
        const file = bundle.entryAsset.generated.html;
        for (const line of file.replace(/\>\</g, '>\n<').split('\n')) {
          if (line && line !== '') {
            const match = line.match(/id="([^"]+)" (?:src|href)="([^"]+)"/);
            if (match) {
              const [, key, value] = match;
              manifestValue[key] = publicURL + path.basename(value);
            }
          }
        }
      }
    }
    return manifestValue;
  }
};
