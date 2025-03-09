import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '', 
  direction = null,
  ...props 
}) => {
  let initial = { opacity: 0 };
  let animate = { opacity: 1 };
  
  // Add direction-based animations if specified
  if (direction === 'up') {
    initial.y = 20;
    animate.y = 0;
  } else if (direction === 'down') {
    initial.y = -20;
    animate.y = 0;
  } else if (direction === 'left') {
    initial.x = 20;
    animate.x = 0;
  } else if (direction === 'right') {
    initial.x = -20;
    animate.x = 0;
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn; 