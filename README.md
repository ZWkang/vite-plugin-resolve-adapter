# vite-plugin-resolve-adapter

> description:

This tool is capable of adapting file suffixes based on the environment when retrieving files, in order to differentiate between multiple environment logics. It is similar to Taro's environment adaptation solution, but implemented in Vite.

## Features

- [x] support relative project file enable
- [ ] enable node_modules file include suffix adapter

## Try it now

```bash
pnpm i vite-plugin-resolve-adapter@latest
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import resolveAdapter from 'vite-plugin-resolve-adapter';

export default defineConfig({
  plugins: [resolveAdapter()],
});
```

## LICENSE

[MIT](./LICENSE) License © 2022 [zwkang](https://github.com/zwkang)
