export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  


  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'chrome_update') {
      return
    }

    //console.log('Extension installed or updated:', details);
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        //console.log('This is a new installation.');
        chrome.tabs.create({
          url: chrome.runtime.getURL('welcome/index.html')
        });
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        //console.log('Extension updated from version', details.previousVersion);
    }
});


  // Handle authentication requests
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'signIn') {
      handleSignIn(sendResponse);
      return true; // Indicates we'll send a response asynchronously
    }
    
    if (message.action === 'getAuth' && message.target === 'background') {
      forwardToOffscreen(message, sendResponse);
      return true; // Indicates we'll send a response asynchronously
    }
  });
  
  // Import the authenticateWithFirebase function
  const { authenticateWithFirebase } = await import('../firebase/firebaseClient');

  // Function to handle sign-in
  async function handleSignIn(sendResponse: (response: any) => void) {
    try {
      // Create offscreen document if it doesn't exist
      try {
        await chrome.offscreen.createDocument({
          url: chrome.runtime.getURL('offscreen/index.html'),
          reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
          justification: 'Firebase authentication'
        });
        console.log('Offscreen document created for auth');
      } catch (e) {
        console.log('Offscreen document might already exist:', e);
      }
      
      // Ask the offscreen page to handle auth
      const response = await chrome.runtime.sendMessage({
        action: 'getAuth',
        target: 'offscreen'
      });
      
      // If we have a valid user response
      if (response && response.uid) {
        const minimalUser = {
          uid: response.uid,
          email: response.email,
          displayName: response.displayName
        };
        
        // Authenticate Firebase with the user ID
        await authenticateWithFirebase(response.uid);
        
        // Store user info in extension storage
        await browser.storage.local.set({ user: minimalUser });
      }
      
      sendResponse(response);
    } catch (e) {
      console.error('Error during sign in:', e);
      sendResponse({ error: e.message || 'Unknown error during sign in' });
    }
  }
  
  // Function to forward messages to offscreen page
  async function forwardToOffscreen(message: any, sendResponse: (response: any) => void) {
    try {
      // Create offscreen document if it doesn't exist
      try {
        await chrome.offscreen.createDocument({
          url: chrome.runtime.getURL('offscreen/index.html'),
          reasons: ['AUTH'],
          justification: 'Firebase authentication'
        });
        console.log('Offscreen document created for auth');
      } catch (e) {
        console.log('Offscreen document might already exist:', e);
      }
      
      // Forward the message to the offscreen page
      const response = await chrome.runtime.sendMessage({
        action: 'getAuth',
        target: 'offscreen'
      });
      
      sendResponse(response);
    } catch (e) {
      console.error('Error forwarding to offscreen:', e);
      sendResponse({ error: e.message || 'Unknown error forwarding to offscreen' });
    }
  }


  // Function to update dynamic rules
const updateDynamicRules = async (newRules = []) => {
  const oldRules = await browser.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules,
  });
};

// Add dynamic rules to block similar trips
const addNewRules = () => {
  const newRules = [
    // {
    //   id: 1,
    //   priority: 1,
    //   action: { type: "block" },
    //   condition: { urlFilter: "similar" },
    // },
    // {
    //   id: 2,
    //   priority: 1,
    //   action: { type: "block" },
    //   condition: { urlFilter: "recommendations" },
    // },
    {
      id: 3,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: "api/loadboard/summary" },
    },



   
  ];
  updateDynamicRules(newRules as any);
};

// Remove dynamic rules
const removeOldRules = () => {
  updateDynamicRules();
};

addNewRules();

});


