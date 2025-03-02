import { createRoot } from 'react-dom/client';
import { OrderCheckbox } from '@/components/OrderCheckbox';
import { CalendarWidget } from '@/components/CalendarWidget'; // Update this path to match where your CalendarWidget is located
import './style.css';

export default defineContentScript({
  matches: ['*://relay.amazon.com/*'],

  main(ctx) {
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



    const checkbox = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '.order-id',

      onMount: (container) => {
        // Create and render the Checkbox
        const checkboxContainer = document.createElement('span');
        const orderId = container.textContent?.trim();
        const root = createRoot(checkboxContainer);
        root.render(<OrderCheckbox />);
        
        // Prepend the calendar to the container's parent
        container.parentElement?.prepend(checkboxContainer);
      },
    });

    // Call autoMount to observe anchor element for add/remove.
    ui.autoMount();
    checkbox.autoMount();
  },
});