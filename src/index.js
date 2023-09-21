import { promises as fs } from 'fs';
import { collectGmApi, getMetadata } from './util';

export default (meta, transform) => {
  const grantMap = new Map();
  const metamap = typeof meta === 'string' ? { default: meta } : meta;

  return {
    name: 'userscript-metadata',
    buildStart() {
      Object.values(metamap).forEach((file) => {
        this.addWatchFile(file)
      })
    },
    transform(code, id) {
      const ast = this.parse(code);
      const grantSetPerFile = collectGmApi(ast);
      grantMap.set(id, grantSetPerFile);
    },
    /**
     * Use `renderChunk` instead of `banner` to preserve the metadata after minimization.
     * Note that this plugin must be put after `@rollup/plugin-terser`.
     */
    async renderChunk(code, chunk) {
      const metafile = metamap[chunk.name] || metamap.default;
      if (!metafile) {
        throw new Error(`rollup-plugin-userscript config invalid: found no metadata for ${chunk.name}`);
      }

      const meta = await fs.readFile(metafile, 'utf8');
      const grantSet = new Set();
      for (const id of chunk.moduleIds) {
        const grantSetPerFile = grantMap.get(id);
        if (grantSetPerFile) {
          for (const item of grantSetPerFile) {
            grantSet.add(item);
          }
        }
      }
      let metadata = getMetadata(meta, grantSet);
      if (transform) metadata = transform(metadata);
      return `${metadata}\n\n${code}`;
    },
  };
};
