
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface LoadMoreTriggerProps {
  onLoadMore: () => void;
}

const LoadMoreTrigger: React.FC<LoadMoreTriggerProps> = ({ onLoadMore }) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
  });

  useEffect(() => {
    if (inView) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);

  return <div ref={ref} className="h-10" />;
};

export default LoadMoreTrigger;
