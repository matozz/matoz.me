import { FC, MouseEventHandler, PropsWithChildren, useEffect, useState } from 'react';

import classNames from 'classnames';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import Image from 'next/image';
import Link from 'next/link';

interface LinkPreviewProps {
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

const LinkPreview: FC<PropsWithChildren<LinkPreviewProps>> = (props) => {
  const {
    url,
    icon,
    className,
    width = 160,
    height = 100,
    quality = 50,
    layout = 'fixed',
    imageUrl = 'https://avatars.githubusercontent.com/u/56786508?v=4',
    children,
  } = props;

  const [isOpen, setOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const targetRect = (event.target as Element).getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  useEffect(() => setIsMounted(true), []);

  return (
    <>
      {isMounted && (
        <div className="hidden">
          <Image
            src={imageUrl}
            width={width}
            height={height}
            quality={quality}
            layout={layout}
            priority={true}
            alt="hidden image"
          />
        </div>
      )}

      <HoverCard openDelay={50} closeDelay={100} onOpenChange={setOpen}>
        <HoverCardTrigger
          onMouseMove={handleMouseMove}
          className={classNames('font-medium', className)}
          target="_blank"
          href={url}
        >
          <span className="inline-flex items-baseline gap-[2px]">
            {icon && <span className="self-center">{icon}</span>}
            {children}
          </span>
        </HoverCardTrigger>

        <HoverCardContent
          className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 260, damping: 20 },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="shadow-outer-full rounded-xl"
                style={{ x: translateX }}
              >
                <Link
                  href={url}
                  target="_blank"
                  className="block rounded-xl border-2 border-transparent bg-white p-1 shadow-xl dark:bg-gray-200"
                  style={{ fontSize: 0 }}
                >
                  <Image
                    src={imageUrl}
                    width={width}
                    height={height}
                    quality={quality}
                    layout={layout}
                    priority={true}
                    objectFit="cover"
                    className="h-[100px] rounded-lg object-cover"
                    alt="preview image"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardContent>
      </HoverCard>
    </>
  );
};

export default LinkPreview;