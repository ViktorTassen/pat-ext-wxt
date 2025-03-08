import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import './style.css';
import { Typography } from '@mui/material';
import { theme } from '../../utils/theme';

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
                            {/* <OrderCheckbox orderId={orderId} /> */}
                        </ThemeProvider>
                    );

                    container.prepend(LoadCardContainer);
                },
            });
        }

        // Observe the order ID elements and create the card UI
        function observeLoadCardElements() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (!mutation.addedNodes.length) continue;

                    const loadCardElements = document.querySelectorAll(".load-card:not([data-checkbox-initialized])");
                    for (const element of loadCardElements) {
                        element.setAttribute("data-loadcard-initialized", "true");
                        const loadCardUi = createLoadCardUi(element as HTMLElement);
                        loadCardUi.mount();
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        // observeLoadCardElements();
    },
});