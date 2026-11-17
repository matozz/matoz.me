import Prism from 'prismjs';

// Let the renderer highlight after hydration; automatic highlighting rewrites
// code whitespace before React can match the server HTML.
Prism.manual = true;

export { Code } from 'react-notion-x/third-party/code';
