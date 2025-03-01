import React from 'react';
import ReactDOM from 'react-dom/client';

type InjectionConfig = {
  targetSelector: string;
  containerId: string;
  position: InsertPosition;
  component: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

/**
 * A reusable utility for injecting React components into web pages
 */
export class ComponentInjector {
  private config: InjectionConfig;
  private observer: MutationObserver | null = null;
  private urlObserver: MutationObserver | null = null;
  private lastUrl: string = '';
  private injected: boolean = false;
  
  constructor(config: InjectionConfig) {
    this.config = config;
    this.lastUrl = window.location.href;
  }
  
  /**
   * Initialize the injector with URL change detection and DOM observation
   */
  public initialize(urlPattern?: RegExp): void {
    // Check if we should run on this page
    if (urlPattern && !urlPattern.test(window.location.href)) {
      return;
    }
    
    // Try to inject immediately
    this.checkAndInject();
    
    // Set up observers
    this.setupDomObserver();
    this.setupUrlChangeDetection();
    
    // Also try after a short delay
    setTimeout(() => this.checkAndInject(), 500);
  }
  
  /**
   * Clean up all observers
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.urlObserver) {
      this.urlObserver.disconnect();
      this.urlObserver = null;
    }
  }
  
  /**
   * Set up detection for DOM changes
   */
  private setupDomObserver(): void {
    this.observer = new MutationObserver(() => {
      this.checkAndInject();
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  }
  
  /**
   * Set up detection for URL changes (for SPA navigation)
   */
  private setupUrlChangeDetection(): void {
    // Create a new observer instance for URL changes
    this.urlObserver = new MutationObserver(() => {
      if (this.lastUrl !== window.location.href) {
        this.lastUrl = window.location.href;
        console.log('URL changed to:', this.lastUrl);
        
        // Reset injection state
        this.injected = false;
        
        // Check for target element
        this.checkAndInject();
        
        // Also check after delays to handle async loading
        setTimeout(() => this.checkAndInject(), 500);
        setTimeout(() => this.checkAndInject(), 1000);
      }
    });
    
    this.urlObserver.observe(document, { subtree: true, childList: true });
    
    // Also listen for popstate events
    window.addEventListener('popstate', () => {
      this.injected = false;
      setTimeout(() => this.checkAndInject(), 500);
    });
    
    // Intercept history.pushState
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.injected = false;
      setTimeout(() => this.checkAndInject(), 500);
    };
  }
  
  /**
   * Check for the target element and inject the component if needed
   */
  private checkAndInject(): void {
    // If already injected, don't do anything
    if (this.injected) return;
    
    const targetElement = document.querySelector(this.config.targetSelector);
    const existingContainer = document.getElementById(this.config.containerId);
    
    // If target exists and our container doesn't exist yet
    if (targetElement && !existingContainer) {
      console.log(`Target element found, injecting component into ${this.config.containerId}`);
      
      // Create container
      const container = document.createElement('div');
      container.id = this.config.containerId;
      
      // Insert at specified position
      targetElement.insertAdjacentElement(this.config.position, container);
      
      // Render React component
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(this.config.component, this.config.componentProps));
      
      // Mark as injected
      this.injected = true;
    }
  }
}