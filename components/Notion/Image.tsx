import { useCallback, useState, type ImgHTMLAttributes } from 'react';

import { ArrowUpRight, ImageOff } from 'lucide-react';

import { Button } from '@/components/ui/button';

type Props = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'className' | 'style' | 'width' | 'height' | 'sizes' | 'onLoad' | 'loading'
> & { src?: string; priority?: boolean };

export const NotionImage = ({ src, alt = '', priority, loading, ...props }: Props) => {
  const [failedSource, setFailedSource] = useState<string>();
  const imageRef = useCallback(
    (image: HTMLImageElement | null) => {
      // An SSR image can fail before React attaches the error handler.
      if (image?.complete && image.currentSrc && image.naturalWidth === 0) setFailedSource(src);
    },
    [src],
  );

  if (!src || failedSource === src) {
    const original = src && /^https?:\/\//i.test(src) ? src : undefined;
    return (
      <div className="notion-image-fallback">
        <ImageOff size={14} aria-hidden="true" />
        <span>Image unavailable{alt && alt !== 'notion image' ? `: ${alt}` : ''}</span>
        {original && (
          <Button asChild variant="link" size="xs">
            <a href={original} target="_blank" rel="noopener noreferrer">
              Open original <ArrowUpRight data-icon="inline-end" />
            </a>
          </Button>
        )}
      </div>
    );
  }

  return (
    // Native images preserve the Notion renderer's load and image-zoom hooks.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      ref={imageRef}
      src={src}
      alt={alt}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      decoding="async"
      onError={() => setFailedSource(src)}
    />
  );
};
