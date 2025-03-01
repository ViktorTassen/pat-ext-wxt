import { CalendarWidget } from '@/components/CalendarWidget';
import { ComponentInjector } from '@/lib/contentScriptUtils';
import './style.css';

export default defineContentScript({
  matches: ['*://*.amazon.com/*', '*://relay.amazon.com/*'],
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
  },
});