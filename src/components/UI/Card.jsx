import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  shadow = 'medium',
  ...props 
}) => {
  const classes = [
    'card',
    `card-padding-${padding}`,
    `card-shadow-${shadow}`,
    hover ? 'card-hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;