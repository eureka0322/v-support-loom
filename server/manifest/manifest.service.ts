import { Inject, Injectable } from '@nestjs/common';

import { ROOT_PATH } from '../config/rootPath.provider';

type Manifest = Record<string, string>;

@Injectable()
export class ManifestService {
  constructor(@Inject(ROOT_PATH) private readonly rootPath: string) {}

  private getManifest(): Manifest {
    let manifest: Manifest = {};

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      manifest = require(`${this.rootPath}/../private/manifest.json`);
    } catch (err) {
      throw new Error('The manifest file could not be found.');
    }

    return manifest;
  }

  get(name: string): string {
    const manifest = this.getManifest();
    const path = manifest[name];

    if (!path) {
      throw new Error(`The key '${name}' was not found in the manifest file.`);
    }

    return path;
  }
}
