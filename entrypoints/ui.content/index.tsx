import { createRoot } from 'react-dom/client';
import { OrderCheckbox } from '@/components/OrderCheckbox';
import { CalendarWidget } from '@/components/CalendarWidget'; // Update this path to match where your CalendarWidget is located
import './style.css';

export default defineContentScript({
  matches: ['*://relay.amazon.com/*'],

  main(ctx) {

    // create UI
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      // It observes the anchor
      anchor: '#show-order-table',
      append: 'first',
      onMount: (container) => {
        // Create and render the CalendarWidget
        const calendarContainer = document.createElement('div');
        const root = createRoot(calendarContainer);
        root.render(<CalendarWidget />);
        
        // Prepend the calendar to the container's parent
        container.parentElement?.prepend(calendarContainer);
      },
    });

    // Create the checkbox UI
    function createCheckboxUi(anchor: HTMLElement) {
      return createIntegratedUi(ctx, {
        position: 'inline',
        anchor,
    
        onMount: (container) => {
          // Create and render the Checkbox
          const checkboxContainer = document.createElement('span');
          const root = createRoot(checkboxContainer);
          root.render(<OrderCheckbox />);
    
          // Prepend the checkbox to the container's parent
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
            const checkboxUi = createCheckboxUi(element as HTMLElement);
            checkboxUi.mount();
          }
        }
      });
    
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
    
    // Mount the UI
    observeOrderIdElements();
    ui.autoMount();

  },
});