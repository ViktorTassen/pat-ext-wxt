import { CalendarWidget } from '@/components/CalendarWidget';
import { OrderCheckbox } from '@/components/OrderCheckbox';
import { ComponentInjector } from '@/lib/contentScriptUtils';
import './style.css';

export default defineContentScript({
  matches: ['*://relay.amazon.com/*'],
  main() {
    console.log('Amazon Relay Calendar Extension loaded');
    
    // Create a component injector for the calendar widget
    const calendarInjector = new ComponentInjector({
      targetSelector: '#show-order-table',
      containerId: 'amazon-relay-calendar-container',
      position: 'afterbegin',
      component: CalendarWidget
    });
    
    // Initialize the injector with a URL pattern
    calendarInjector.initialize(/relay\.amazon\.com\/loadboard\/orders/);
    
    // Create a component injector for the order checkboxes
    const checkboxInjector = new ComponentInjector({
      targetSelector: '.order-id',
      containerId: 'amazon-relay-checkbox-container',
      position: 'beforebegin',
      component: OrderCheckbox
    });
    
    // Initialize the checkbox injector with the same URL pattern
    // Note: This will inject a checkbox before EACH element matching .order-id
    checkboxInjector.initialize(/relay\.amazon\.com\/loadboard\/orders/);
  },
});