import { createRoot } from 'react-dom/client';
import { OrderCheckbox } from '@/components/OrderCheckbox';
import { OrderManagement } from '@/components/OrderManagement';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../../utils/theme';
import './style.css';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';


// Create a shared cache for Emotion
const emotionCache = createCache({
  key: 'pat-ui',
});



export default defineContentScript({
  matches: ['*://relay.amazon.com/*'],

  async main(ctx) {

    // create UI
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#show-order-table',
      append: 'first',
      onMount: (container) => {
        const managementContainer = document.createElement('div');
        container.parentElement?.prepend(managementContainer);
        const root = createRoot(managementContainer);
        root.render(
          <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <OrderManagement />
            </LocalizationProvider>
          </ThemeProvider>
        </CacheProvider>
        );
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    ui.autoMount();
  },

  
});

