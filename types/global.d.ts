export {};

declare global {
  namespace CSS {
    let paintWorklet: { addModule: (module: string) => Promise<void> } | undefined;
  }
}
