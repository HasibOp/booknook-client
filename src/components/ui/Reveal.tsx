'use client';

import { motion } from 'motion/react';

type RevealProps = {
  children: React.ReactNode;
  as?: 'div' | 'li';
  delay?: number;
  y?: number;
  className?: string;
};

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  className,
}: RevealProps) {
  const Component = as === 'li' ? motion.li : motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
