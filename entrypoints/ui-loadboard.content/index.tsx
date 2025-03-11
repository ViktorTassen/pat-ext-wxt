import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import './style.css';
import { theme } from '../../utils/theme';
import { LoadCard } from '../../components/LoadCard';
import { WorkOpportunitiesProvider } from '@/utils/WorkOpportunitiesContext';

// Create a shared cache for Emotion
const emotionCache = createCache({
  key: 'pat',
});

export default defineContentScript({
  matches: ['*://relay.amazon.com/loadboard*'],

  main(ctx) {
    function createLoadCardUi(anchor: HTMLElement) {
      return createIntegratedUi(ctx, {
        position: 'inline',
        anchor,
        onMount: (container) => {
          const LoadCardContainer = document.createElement('span');
          const root = createRoot(LoadCardContainer);
          root.render(
            <ThemeProvider theme={theme}>
              <CacheProvider value={emotionCache}>
                <WorkOpportunitiesProvider>
                <LoadCard workOpportunityId={anchor.id} />
                </WorkOpportunitiesProvider>
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

    function observeLoadCardElements() {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const newNodes = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
            const uuidElements = newNodes.flatMap(node => 
              Array.from((node as Element).querySelectorAll('[id]')).filter(el => el.id.length === 36)
            );
            for (const element of uuidElements) {
              element.setAttribute("data-loadcard-initialized", "true");
              const loadCardUi = createLoadCardUi(element.parentElement as HTMLElement);
              loadCardUi.mount();
            }
          }
        }
      });

      const activeTabBody = document.getElementById("active-tab-body");
      if (activeTabBody) {
        observer.observe(activeTabBody, {
          childList: true,
          subtree: true,
        });
      }
    }

    observeLoadCardElements();
  },
});