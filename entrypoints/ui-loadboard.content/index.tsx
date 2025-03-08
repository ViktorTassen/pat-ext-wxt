import { createRoot } from 'react-dom/client';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './style.css';
import { Typography } from '@mui/material';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#006d9e',
            '50': '#e3f2fd',
            '800': '#01579b',
        },
        info: {
            main: '#0288d1',
            '50': '#e1f5fe',
            '200': '#81d4fa',
            '700': '#0288d1',
            '800': '#0277bd',
        },
        grey: {
            '50': '#fafafa',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
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

                    const loadCardElements = document.querySelectorAll(".load-card:not([data-loadcard-initialized])");
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

        observeLoadCardElements();
        // ui.autoMount();
    },
});