import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import './style.css';
import { theme } from '../../utils/theme';
import { LoadCard } from '../../components/LoadCard';
  
export default defineContentScript({
  matches: [
    "*://relay.amazon.com/loadboard*",
    "*://relay.amazon.co.uk/loadboard*",
    "*://relay.amazon.de/loadboard*",
    "*://relay.amazon.es/loadboard*",
    "*://relay.amazon.ca/loadboard*",
    "*://relay.amazon.fr/loadboard*",
    "*://relay.amazon.it/loadboard*",
    "*://relay.amazon.pl/loadboard*",
    "*://relay.amazon.in/loadboard*",
    "*://relay.amazon.cz/loadboard*",
    "*://relay.amazon.co.jp/loadboard*"
  ],
  main(ctx) {
    // Track all created UI components for proper cleanup
    const createdUis = new Set<any>();
    
    // Keep track of active observers
    const activeObservers = new Map<string, MutationObserver>();
    const processedIds = new Set<string>();
    
    function createLoadCardUi(anchor: HTMLElement, workOpportunity: any) {
      // Find the appropriate parent element to inject our UI
      // Look for the first parent with display flex that contains our target element
      let targetElement = anchor;
      let parentElement = anchor.parentElement;
    
      
      
      const ui = createIntegratedUi(ctx, {
        position: 'inline',
        anchor: parentElement,
        onMount: (container) => {
          const LoadCardContainer = document.createElement('span');
          LoadCardContainer.style.marginLeft = '8px'; // Add some spacing
          // LoadCardContainer.style.float = 'right'; // Push to the right
          // LoadCardContainer.style.paddingRight = '32px'; // Add some spacing
          const root = createRoot(LoadCardContainer);
          root.render(
            <ThemeProvider theme={theme}>
              <LoadCard workOpportunityId={anchor.id} workOpportunity={workOpportunity} />
            </ThemeProvider>
          );
          
          container.append(LoadCardContainer);
          return root;
        },
        onRemove: (root) => {
          root?.unmount();
        },
      });
      
      // Track the UI for cleanup
      createdUis.add(ui);
      return ui;
    }

    // Function to wait for an element using MutationObserver with timeout
    function waitForElementWithId(id: string): Promise<HTMLElement | null> {
      return new Promise((resolve) => {
        // Check if element already exists
        const element = document.getElementById(id) as HTMLElement;
        if (element) {
          resolve(element);
          return;
        }
        
        // Set up observer to watch for new elements
        const observer = new MutationObserver(() => {
          const element = document.getElementById(id) as HTMLElement;
          if (element) {
            observer.disconnect();
            activeObservers.delete(id);
            resolve(element);
          }
        });
        
        // Start observing with configuration
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Store the observer reference
        activeObservers.set(id, observer);
        
        // Set a timeout to prevent indefinite waiting
        setTimeout(() => {
          if (activeObservers.has(id)) {
            observer.disconnect();
            activeObservers.delete(id);
            resolve(null);
          }
        }, 5000);
      });
    }
    
    // Initialize load cards from work opportunities
    function initializeLoadCards() {
      // Listen for workOpportunities event
      window.addEventListener('pat-workOpportunities', (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.workOpportunities && Array.isArray(customEvent.detail.workOpportunities)) {
          const workOpps = customEvent.detail.workOpportunities;
          
          // Clear processedIds when we get new work opportunities
          // This allows us to reprocess everything when the table refreshes
          processedIds.clear();
          
          // Process each work opportunity
          workOpps.forEach((workOpportunity: any) => {
            const id = workOpportunity.id;
            
            // Wait for element and create UI
            waitForElementWithId(id).then(anchor => {
              if (anchor && !anchor.getAttribute("data-loadcard-initialized")) {
                anchor.setAttribute("data-loadcard-initialized", "true");
                processedIds.add(id);
                const loadCardUi = createLoadCardUi(anchor, workOpportunity);
                if (loadCardUi) {
                  loadCardUi.mount();
                }
              }
            });
          });
        }
      });
    }
    
    // Start the process
    initializeLoadCards();
    
    // Clean up when context is invalidated
    ctx.onInvalidated(() => {
      // Clean up all observers
      activeObservers.forEach(observer => observer.disconnect());
      activeObservers.clear();
      
      // Clean up all UIs
      createdUis.forEach(ui => {
        try {
          if (ui && typeof ui.unmount === 'function') {
            ui.unmount();
          }
        } catch (e) {
          console.error('Error unmounting UI:', e);
        }
      });
      createdUis.clear();
      
      // Clear processed IDs
      processedIds.clear();
    });
  },
});