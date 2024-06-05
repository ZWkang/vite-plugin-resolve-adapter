// import Debug from 'debug';

export const queryRE = /\?.*$/s
export const hashRE = /#.*$/s

export const cleanUrl = (url: string): string => url.replace(hashRE, '').replace(queryRE, '')

// export const debug = Debug('vite-plugin-resolve-adapter');

export const isDebug = process.env.DEBUG
