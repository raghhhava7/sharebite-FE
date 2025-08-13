import { useEffect } from 'react';
import { config } from '../../config/app';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Web Vitals monitoring
    const observeWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
          
          // Send to analytics service
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(lastEntry.startTime),
              event_category: 'Performance'
            });
          }
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported');
        }

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
            
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'FID',
                value: Math.round(entry.processingStart - entry.startTime),
                event_category: 'Performance'
              });
            }
          });
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observer not supported');
        }

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          console.log('CLS:', clsValue);
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'CLS',
              value: Math.round(clsValue * 1000),
              event_category: 'Performance'
            });
          }
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observer not supported');
        }
      }
    };

    // Navigation timing
    const logNavigationTiming = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          console.log('Navigation Timing:', {
            'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
            'TCP Connection': navigation.connectEnd - navigation.connectStart,
            'Request': navigation.responseStart - navigation.requestStart,
            'Response': navigation.responseEnd - navigation.responseStart,
            'DOM Processing': navigation.domComplete - navigation.domLoading,
            'Load Complete': navigation.loadEventEnd - navigation.loadEventStart
          });
        }
      }
    };

    // Resource timing
    const logResourceTiming = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (slowResources.length > 0) {
          console.warn('Slow loading resources:', slowResources.map(r => ({
            name: r.name,
            duration: r.duration,
            size: r.transferSize
          })));
        }
      }
    };

    // Memory usage (if available)
    const logMemoryUsage = () => {
      if ('memory' in performance) {
        console.log('Memory Usage:', {
          'Used JS Heap Size': Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
          'Total JS Heap Size': Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
          'JS Heap Size Limit': Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }
    };

    // Run monitoring only in production or when explicitly enabled
    if (config.env.isProduction || config.features.performanceMonitoring) {
      // Wait for page load
      if (document.readyState === 'complete') {
        observeWebVitals();
        logNavigationTiming();
        logResourceTiming();
        logMemoryUsage();
      } else {
        window.addEventListener('load', () => {
          observeWebVitals();
          logNavigationTiming();
          logResourceTiming();
          logMemoryUsage();
        });
      }
    }

    // Cleanup function
    return () => {
      // Performance observers are automatically cleaned up when component unmounts
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;