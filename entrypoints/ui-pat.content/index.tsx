import { createRoot } from 'react-dom/client';
import { OrderCheckbox } from '@/components/OrderCheckbox';
import { OrderManagement } from '@/components/OrderManagement';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../utils/theme';
import './style.css';


const watchPattern = new MatchPattern('*://*.relay.amazon.*/loadboard/orders?state*');

export default defineContentScript({
  matches: [
    "*://relay.amazon.com/loadboard/*",
    "*://relay.amazon.co.uk/loadboard/*",
    "*://relay.amazon.de/loadboard/*",
    "*://relay.amazon.es/loadboard/*",
    "*://relay.amazon.ca/loadboard/*",
    "*://relay.amazon.fr/loadboard/*",
    "*://relay.amazon.it/loadboard/*",
    "*://relay.amazon.pl/loadboard/*",
    "*://relay.amazon.in/loadboard/*",
    "*://relay.amazon.cz/loadboard/*",
    "*://relay.amazon.co.jp/loadboard/*"
  ],





  async main(ctx) {
    ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
      console.log('locationchange', newUrl);
      if (watchPattern.includes(newUrl)) mainWatch(ctx);
    });
    mainWatch(ctx)
  },
});



function mainWatch(ctx: any) {

  console.log('ui pat content script loaded');
  // Track all created UI components for cleanup
  const createdCheckboxUis = new Set<any>();
  // Create the management UI
  const ui = createIntegratedUi(ctx, {
    position: 'inline',
    anchor: '#show-order-table',
    append: 'first',
    onMount: (container) => {
      const managementContainer = document.createElement('div');
      container.parentElement?.prepend(managementContainer);
      const root = createRoot(managementContainer);
      root.render(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <OrderManagement />
          </LocalizationProvider>
        </ThemeProvider>
      );
      return root;
    },
    onRemove: (root) => {
      root?.unmount();
    },
  });

  // Create the checkbox UI
  function createCheckboxUi(anchor: HTMLElement, orderId: string) {
    const checkboxUi = createIntegratedUi(ctx, {
      position: 'inline',
      anchor,
      onMount: (container) => {
        const checkboxContainer = document.createElement('span');
        container.parentElement?.prepend(checkboxContainer);
        const root = createRoot(checkboxContainer);
        root.render(
          <ThemeProvider theme={theme}>
            <OrderCheckbox orderId={orderId} />
          </ThemeProvider>
        );
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });
    
    // Track UI for cleanup
    createdCheckboxUis.add(checkboxUi);
    return checkboxUi;
  }
  
  // Process existing order ID elements
  function processOrderIdElements() {
    const orderIdElements = document.querySelectorAll(".order-id:not([data-checkbox-initialized])");
    for (const element of Array.from(orderIdElements)) {
      element.setAttribute("data-checkbox-initialized", "true");
      const checkboxUi = createCheckboxUi(element as HTMLElement, element.textContent?.trim() || '');
      checkboxUi.mount();
    }
  }
  
  // Observe the order ID elements and create the checkboxes
  function observeOrderIdElements() {
    // Process existing elements first
    processOrderIdElements();
    
    // Set up observer for future elements
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (!mutation.addedNodes.length) continue;
        processOrderIdElements();
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Clean up when context is invalidated
    ctx.onInvalidated(() => {
      observer.disconnect();
      
      // Clean up all checkbox UIs
      createdCheckboxUis.forEach(ui => {
        try {
          if (ui && typeof ui.unmount === 'function') {
            ui.unmount();
          }
        } catch (e) {
          console.error('Error unmounting checkbox UI:', e);
        }
      });
      createdCheckboxUis.clear();
    });
  }

  observeOrderIdElements();
  ui.autoMount();

}