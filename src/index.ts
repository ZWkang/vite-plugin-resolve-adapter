import { Plugin, UserConfig, createFilter } from 'vite';

import nodePath from 'node:path';
import fs from 'node:fs';

import { cleanUrl, isDebug } from './util';

export type ViteConfig = Readonly<
  Omit<UserConfig, 'plugins' | 'assetsInclude' | 'optimizeDeps' | 'worker'> & {
    include?: UserConfig['assetsInclude'];
    exclude?: UserConfig['assetsInclude'];
    env?: string;
    root?: string;
    extension?: string[];
  }
>;

const defaultExclude = [/node_modules/];

const defaultOpts = {
  env: 'overseas',
  exclude: defaultExclude,
  include: [],
  root: process.cwd(),
  extension: ['.overseas'],
};

export default function resolveEnhance(opt: ViteConfig = defaultOpts): Plugin {
  const config = { ...defaultOpts, ...opt };
  return {
    name: 'vite-plugin-resolve-adapter',
    enforce: 'pre',
    async resolveId(id, importer, resolveOpts) {
      const filter = createFilter(config.include, config.exclude, {
        resolve: config.root,
      });
      const resolved = await this.resolve(id, importer, {
        skipSelf: true,
        ...resolveOpts,
      });
      if (resolved && filter(resolved.id)) {
        const newPath = resolveExtensionPath(resolved.id, [config.env]);
        isDebug && console.log(`[adapter] ${id} -> ${newPath}`);
        return newPath;
      }
    },
  };
}

/**
 * get a path, according the extensions to detect file exists
 * if exists, return the replace new file path.
 * @param path
 * @param extensions
 * @returns
 */
function resolveExtensionPath(path: string, extensions: string[]) {
  const cleanId = cleanUrl(path);
  const extname = nodePath.extname(cleanId);
  const filename = nodePath.basename(cleanId, extname);
  const dirname = nodePath.dirname(cleanId);
  if (!extname) return cleanId;
  const fullPath = nodePath.join(dirname, filename);
  const ext = extensions.find((ext) => fs.existsSync(`${fullPath}.${ext}${extname}`));
  if (ext) {
    return `${fullPath}.${ext}${extname}`;
  }
  return cleanId;
}
