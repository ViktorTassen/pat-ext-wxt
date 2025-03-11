import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import './style.css';
import { theme } from '../../utils/theme';
import { LoadCard } from '../../components/LoadCard';

// Create a shared cache for Emotion
const emotionCache = createCache({
  key: 'pat',
});
  
export default defineContentScript({
  matches: ['*://relay.amazon.com/loadboard*'],
  main(ctx) {
    // Keep track of active observers and timeouts
    const activeObservers = new Map<string, { observer: MutationObserver, timeoutId: number }>();
    
    function createLoadCardUi(anchor: HTMLElement, workOpportunity: any) {
      return createIntegratedUi(ctx, {
        position: 'inline',
        anchor,
        onMount: (container) => {
          const LoadCardContainer = document.createElement('span');
          const root = createRoot(LoadCardContainer);
          root.render(
            <ThemeProvider theme={theme}>
              <CacheProvider value={emotionCache}>
                  <LoadCard workOpportunityId={anchor.id} workOpportunity={workOpportunity} />
              </CacheProvider>
            </ThemeProvider>
          );
          
          container.append(LoadCardContainer);
          return root;
        },
        onRemove: (root) => {
          root?.unmount();
        },
      });
    }

    // Function to wait for an element using MutationObserver with timeout
    function waitForElement(id: string, timeout = 5000): Promise<HTMLElement | null> {
      const selector = "#" + id;
      
      // Clean up any existing observer for this ID
      cleanupObserver(id);
      
      return new Promise((resolve) => {
        // Check if element already exists
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          resolve(element);
          return;
        }
        
        // Create timeout to prevent memory leaks
        const timeoutId = window.setTimeout(() => {
          cleanupObserver(id);
          resolve(null); // Return null if element is not found within timeout
        }, timeout);
        
        // Set up observer to watch for new elements
        const observer = new MutationObserver((mutations, obs) => {
          const element = document.querySelector(selector) as HTMLElement;
          if (element) {
            cleanupObserver(id);
            resolve(element);
          }
        });
        
        // Start observing with configuration
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Store the observer and timeout reference
        activeObservers.set(id, { observer, timeoutId });
      });
    }
    
    // Helper function to clean up observer and timeout
    function cleanupObserver(id: string) {
      const observerData = activeObservers.get(id);
      if (observerData) {
        const { observer, timeoutId } = observerData;
        observer.disconnect();
        clearTimeout(timeoutId);
        activeObservers.delete(id);
      }
    }
    
    // Clean up all observers and timeouts
    function cleanupAllObservers() {
      activeObservers.forEach(({ observer, timeoutId }) => {
        observer.disconnect();
        clearTimeout(timeoutId);
      });
      activeObservers.clear();
    }
    
    function gogogo() {
      const processedIds = new Set<string>();
      
      // Listen for workOpportunities event
      window.addEventListener('pat-workOpportunities', (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.workOpportunities && Array.isArray(customEvent.detail.workOpportunities)) {
          // Clean up existing observers when new data arrives
          cleanupAllObservers();
          
          const workOpps = customEvent.detail.workOpportunities;
          
          // Process each work opportunity
          workOpps.forEach((workOpportunity: any) => {
            const id = workOpportunity.id;
            
            // Skip if already processed
            if (processedIds.has(id)) return;
            
            // Wait for element and create UI
            waitForElement(id).then(anchor => {
              if (anchor && !anchor.getAttribute("data-loadcard-initialized")) {
                anchor.setAttribute("data-loadcard-initialized", "true");
                processedIds.add(id);
                const loadCardUi = createLoadCardUi(anchor, workOpportunity);
                loadCardUi.mount();
              }
            });
          });
        }
      });
    }
    
    // Start the process
    gogogo();
  },
});