import { FC, MouseEventHandler, PropsWithChildren, useState } from 'react';

import classNames from 'classnames';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import Image from 'next/image';
import Link from 'next/link';

interface LinkPreviewProps {
  url: string;
  name?: string;
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
    name,
    className,
    width = 160,
    height = 100,
    quality = 50,
    layout = 'fixed',
    imageUrl = 'https://avatars.githubusercontent.com/u/56786508?v=4',
    children,
  } = props;

  const [isOpen, setOpen] = useState(true);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const targetRect = (event.target as Element).getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  return (
    <HoverCard openDelay={50} closeDelay={100} onOpenChange={setOpen}>
      <HoverCardTrigger href={url} target="_blank" aria-label={name} onMouseMove={handleMouseMove}>
        <span className={classNames('inline-flex items-baseline gap-[2px] font-medium', className)}>
          {icon && <span className="self-center">{icon}</span>}
          {children}
        </span>
      </HoverCardTrigger>

      <HoverCardContent
        className="z-20 [transform-origin:var(--radix-hover-card-content-transform-origin)]"
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
              className="rounded-xl shadow-outer-full"
              style={{ x: translateX }}
            >
              <Link
                href={url}
                target="_blank"
                aria-label={name}
                style={{ fontSize: 0 }}
                className="block rounded-xl border-2 border-transparent bg-white p-1 shadow-xl dark:bg-gray-200"
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
  );
};

export default LinkPreview;
