import React from 'react';
import { motion } from 'framer-motion';

const TestComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '20px',
        margin: '20px',
        backgroundColor: 'var(--color-sage-light)',
        borderRadius: '12px',
        textAlign: 'center'
      }}
    >
      <h2 style={{ color: 'var(--color-navy)' }}>ShareBite Test Component</h2>
      <p style={{ color: 'var(--color-gray-700)' }}>
        Framer Motion is working correctly!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '10px 20px',
          backgroundColor: 'var(--color-navy)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </motion.button>
    </motion.div>
  );
};

export default TestComponent;