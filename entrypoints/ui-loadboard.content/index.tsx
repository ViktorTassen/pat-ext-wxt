import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './style.css';
import { Typography } from '@mui/material';
import { theme } from '../../utils/theme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// Create a shared cache for Emotion
const emotionCache = createCache({
    key: 'pat',
  });
  

export default defineContentScript({
    matches: ['*://relay.amazon.com/loadboard*'],

    main(ctx) {
        // Create the checkbox UI
        function createLoadCardUi(anchor: HTMLElement) {
            return createIntegratedUi(ctx, {
                position: 'inline',
                anchor,
                onMount: (container) => {
                    const LoadCardContainer = document.createElement('span');
                    const root = createRoot(LoadCardContainer);
                    root.render(
                        <ThemeProvider theme={theme}>
                            <Typography variant="h6" component="div">
                                Load Card
                            </Typography>

                        </ThemeProvider>
                    );

                    container.prepend(LoadCardContainer);
                    return root;
                },
                onRemove: (root) => {
                    // Unmount the root when the UI is removed
                    root?.unmount();
                },
            });
        }

        // Observe the order ID elements and create the card UI
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
                        const loadCardUi = createLoadCardUi(element as HTMLElement);
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