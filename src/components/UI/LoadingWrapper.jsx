import React from 'react';
import Loading from './Loading';

const LoadingWrapper = ({ isLoading, children, message = 'Loading...' }) => {
  if (isLoading) {
    return <Loading message={message} />;
  }
  
  return children;
};

export default LoadingWrapper;