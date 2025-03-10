import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import './style.css';
import { LoadCard } from '../../components/LoadCard';
import { theme } from '../../utils/theme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Create a shared cache for Emotion
const emotionCache = createCache({
  key: 'loadboard',
});

// Helper function to wait for an element
function waitForElm(selector: string): Promise<HTMLElement> {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector) as HTMLElement);
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector) as HTMLElement);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

export default defineContentScript({
  matches: ['*://relay.amazon.com/loadboard*'],

  main(ctx) {
    // Create the load card UI
    function createLoadCardUi(anchor: HTMLElement, workOpportunityId: string) {
      return createIntegratedUi(ctx, {
        position: 'inline',
        anchor,
        onMount: (container) => {
          const LoadCardContainer = document.createElement('div');
          const root = createRoot(LoadCardContainer);
          root.render(
            <CacheProvider value={emotionCache}>
              <ThemeProvider theme={theme}>
                  <LoadCard workOpportunityId={workOpportunityId} />
              </ThemeProvider>
            </CacheProvider>
          );

          container.prepend(LoadCardContainer);
        },
      });
    }

    // Listen for work opportunities and mount UI
    window.addEventListener('pat-workOpportunities', async (event: Event) => {
      const customEvent = event as CustomEvent;
      const workOpportunities = customEvent.detail?.workOpportunities;

      if (workOpportunities && Array.isArray(workOpportunities)) {
        for (const opportunity of workOpportunities) {
          try {
            // Wait for the element with the opportunity ID to appear
            const element = await waitForElm(`#${opportunity.id}`);
            if (element) {
              const loadCardUi = createLoadCardUi(element, opportunity.id);
              loadCardUi.mount();
            }
          } catch (error) {
            console.error(`Error mounting LoadCard for opportunity ${opportunity.id}:`, error);
          }
        }
      }
    });
  },
});