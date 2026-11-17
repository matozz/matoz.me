import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-notion-x';

import { Check, Copy } from 'lucide-react';
import type { CodeBlock } from 'notion-types';
import { getTextContent } from 'notion-utils';
import Prism from 'prismjs';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-css-extras';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Highlight only after hydration so Prism never rewrites server HTML early.
Prism.manual = true;
const aliases: Record<string, string> = {
  'c++': 'cpp',
  'c#': 'csharp',
  html: 'markup',
  shell: 'bash',
  'plain text': 'plain',
  js: 'javascript',
  ts: 'typescript',
};

export const Code = ({ block }: { block: CodeBlock }) => {
  const label = getTextContent(block.properties.language) || 'Plain text';
  const language = aliases[label.toLowerCase()] ?? label.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const content = getTextContent(block.properties.title).replace(/\u00a0/g, ' ');
  const code = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code.current && Prism.languages[language]) Prism.highlightElement(code.current);
  }, [content, language]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setError('');
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy failed. Select the code to copy it.');
    }
  };

  return (
    <figure className="notion-code-block">
      <div className="code-toolbar">
        <span className="code-language">{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              aria-label={copied ? 'Code copied' : 'Copy code'}
              onClick={copy}
            >
              {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
              <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>Copy code to clipboard</TooltipContent>
        </Tooltip>
        <span role="status" className="sr-only">
          {error || (copied ? 'Code copied to clipboard.' : '')}
        </span>
      </div>
      <pre
        className={`notion-code language-${language}`}
        tabIndex={0}
        aria-label={`${label} code example`}
      >
        <code className={`language-${language}`} ref={code}>
          {content}
        </code>
      </pre>
      {block.properties.caption && (
        <figcaption className="notion-asset-caption">
          <Text value={block.properties.caption} block={block} />
        </figcaption>
      )}
    </figure>
  );
};
