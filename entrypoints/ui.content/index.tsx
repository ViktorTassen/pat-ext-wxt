import { createRoot } from 'react-dom/client';
import { OrderCheckbox } from '@/components/OrderCheckbox';
import { OrderManagement } from '@/components/OrderManagement';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './style.css';

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
  matches: ['*://relay.amazon.com/*'],

  main(ctx) {
    // create UI
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#show-order-table',
      append: 'first',
      onMount: (container) => {
        const managementContainer = document.createElement('div');
        const root = createRoot(managementContainer);
        root.render(
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <OrderManagement />
            </LocalizationProvider>
          </ThemeProvider>
        );
        
        container.parentElement?.prepend(managementContainer);
      },
    });

    // Create the checkbox UI
    function createCheckboxUi(anchor: HTMLElement, orderId: string) {
      return createIntegratedUi(ctx, {
        position: 'inline',
        anchor,
        onMount: (container) => {
          const checkboxContainer = document.createElement('span');
          const root = createRoot(checkboxContainer);
          root.render(
            <ThemeProvider theme={theme}>
              <OrderCheckbox orderId={orderId} />
            </ThemeProvider>
          );
    
          container.parentElement?.prepend(checkboxContainer);
        },
      });
    }
    
    // Observe the order ID elements and create the checkboxes
    function observeOrderIdElements() {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (!mutation.addedNodes.length) continue;

          const orderIdElements = document.querySelectorAll(".order-id:not([data-checkbox-initialized])");
          for (const element of orderIdElements) {
            element.setAttribute("data-checkbox-initialized", "true");
            const checkboxUi = createCheckboxUi(element as HTMLElement, element.textContent?.trim() || '');
            checkboxUi.mount();
          }
          
          // const orderIdElements = document.querySelectorAll("label:has([role='checkbox'])");
          // for (const element of orderIdElements) {
          //   const parent = element.parentElement;
          //   if (!parent || parent.getAttribute("data-checkbox-initialized")) continue;

          //   // Remove the original checkbox
          //   if (parent.firstChild) {
          //     parent.removeChild(parent.firstChild);
          //   }

          //   // Find the order ID element and get its text
          //   const orderIdElement = parent.parentElement?.querySelector('.order-id');
          //   const orderIdText = orderIdElement?.textContent?.trim();
            
          //   if (orderIdText) {
          //     parent.setAttribute("data-checkbox-initialized", "true");
          //     const checkboxUi = createCheckboxUi(parent, orderIdText);
          //     checkboxUi.mount();
          //   }
          // };


        }
      });
    
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
    
    observeOrderIdElements();
    ui.autoMount();
  },
});