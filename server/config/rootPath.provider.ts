import { join } from 'path';

export const ROOT_PATH = Symbol('ROOT_PATH');

export const RootPathProvider = {
  provide: ROOT_PATH,
  useValue: join(__dirname, '..'),
};
