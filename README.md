# rollup-plugin-userscript

![NPM](https://img.shields.io/npm/v/rollup-plugin-userscript.svg)
![License](https://img.shields.io/npm/l/rollup-plugin-userscript.svg)
![Downloads](https://img.shields.io/npm/dt/rollup-plugin-userscript.svg)

Automatically parse metadata and set `@grant`s.

With this plugin, `@grant`s for [`GM_*` functions](https://violentmonkey.github.io/api/metadata-block/) will be added at compile time.

## Usage

Add the plugin to rollup.config.js:

```js
import userscript from 'rollup-plugin-userscript';

const plugins = [
  // ...
  userscript(
    path.resolve('src/meta.js'),
    meta => meta
      .replace('process.env.VERSION', pkg.version)
      .replace('process.env.AUTHOR', pkg.author),
  ),
];
```

Now also supports multiple entrypoints via a map of metadata files:

```js
import userscript from 'rollup-plugin-userscript';

const input = {
  foo: 'foo.js',
  bar: 'bar.js',
  baz: 'baz.js',
};

const plugins = [
  userscript(
    { 
      foo: 'foo.meta.js',
      bar: 'bar.meta.js',
      default: 'meta.js', // Used for entrypoints w/o specific metadata in the map
    },
    meta => meta
      .replace('process.env.VERSION', pkg.version)
      .replace('process.env.AUTHOR', pkg.author),
  ),
];
```
