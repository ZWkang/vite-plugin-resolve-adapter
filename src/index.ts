import { Plugin, UserConfig, createFilter, type ResolvedConfig } from 'vite';

import nodePath from 'node:path';
import fs from 'node:fs';

import { cleanUrl, isDebug } from './util';

export type ViteConfig = Readonly<
  Omit<UserConfig, 'plugins' | 'assetsInclude' | 'optimizeDeps' | 'worker'> & {
    include?: UserConfig['assetsInclude'];
    exclude?: UserConfig['assetsInclude'];
    env?: string | string[];
    root?: string;
  }
>;

const defaultExclude = [/node_modules/];

const defaultOpts = {
  env: 'overseas',
  exclude: defaultExclude,
  include: [],
  root: process.cwd(),
};

export default function resolveEnhance(opt: ViteConfig = defaultOpts): Plugin {
  const config = { ...defaultOpts, ...opt };
  let UserConfig: ResolvedConfig;
  return {
    name: 'vite-plugin-resolve-adapter',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      UserConfig = resolvedConfig;
    },

    async resolveId(id, importer, resolveOpts) {
      const filter = createFilter(config.include, config.exclude, {
        resolve: config.root || UserConfig.root,
      });
      const resolved = await this.resolve(id, importer, {
        skipSelf: true,
        ...resolveOpts,
      });
      if (resolved && filter(resolved.id)) {
        const newPath = resolveExtensionPath(resolved.id, toArray(config.env));
        isDebug && console.log(`[adapter] ${id} -> ${newPath}`);
        return newPath;
      }
    },
  };
}

const maps = new Map();

/**
 * get a path, according the extensions to detect file exists
 * if exists, return the replace new file path.
 * @param path
 * @param extensions
 * @returns
 */
function resolveExtensionPath(path: string, configEnv: string[]) {
  const cleanId = cleanUrl(path);
  const extname = nodePath.extname(cleanId);
  const filename = nodePath.basename(cleanId, extname);
  const dirname = nodePath.dirname(cleanId);
  if (!extname) return cleanId;
  const fullPath = nodePath.join(dirname, filename);
  const ext = configEnv.find((ext) => {
    const newPath = `${fullPath}.${ext}${extname}`;
    if (maps.has(newPath)) {
      return maps.get(newPath);
    }
    const exists = fs.existsSync(newPath);
    maps.set(newPath, exists);
    return exists;
  });
  if (ext) {
    return `${fullPath}.${ext}${extname}`;
  }
  return cleanId;
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
