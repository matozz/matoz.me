import Gtag from 'gtag.js';

declare global {
  namespace CSS {
    let paintWorklet: { addModule: (module: string) => void } | undefined;
  }
}
