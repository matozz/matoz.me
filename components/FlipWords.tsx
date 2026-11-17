import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

const FlipWords = (props: FlipWordsProps) => {
  const { words, duration = 3000, className } = props;

  const [wordIndex, setWordIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const currentWord = words[wordIndex % words.length] ?? '';

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const timer = window.setInterval(() => setWordIndex((index) => index + 1), duration);
    return () => window.clearInterval(timer);
  }, [duration, reduceMotion, words.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: 'blur(8px)',
          scale: 2,
          position: 'absolute',
        }}
        className={classNames(
          'absolute z-10 inline-block text-left text-neutral-700 dark:text-neutral-100',
          className,
        )}
        key={currentWord}
      >
        {currentWord.split('').map((letter, index) => (
          <motion.span
            className="inline-block"
            key={currentWord + index}
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}
          >
            {letter === ' ' ? <>&nbsp;</> : letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
export default FlipWords;
