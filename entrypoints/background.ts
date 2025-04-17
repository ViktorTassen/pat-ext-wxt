/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
import { authenticateWithFirebase } from "../firebase/firebaseClient"


export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'chrome_update') {
      return
    }

    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: chrome.runtime.getURL('welcome/index.html')
      });
    }
  });

  // Function to update dynamic rules
  const updateDynamicRules = async (newRules = []) => {
    const oldRules = await browser.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map(rule => rule.id);
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRuleIds,
      addRules: newRules,
    });
  };

  // Add dynamic rules to block API requests
  const addNewRules = () => {
    const newRules = [
      {
        id: 3,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: "api/loadboard/summary" },
      },
    ];
    updateDynamicRules(newRules as any);
  };

  addNewRules();









  const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';


  let creatingOffscreenDocument: Promise<void> | null;

  async function hasOffscreenDocument() {
    const matchedClients = await self.clients.matchAll()
    return matchedClients.some(
      (c) => c.url === browser.runtime.getURL(OFFSCREEN_DOCUMENT_PATH),
    )
  }


  async function setupOffscreenDocument() {
    if (await hasOffscreenDocument()) return;

    if (creatingOffscreenDocument) {
      await creatingOffscreenDocument;
    } else {
      creatingOffscreenDocument = chrome.offscreen.createDocument({
        url: chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH),
        reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
        justification: 'Firebase Authentication'
      });
      await creatingOffscreenDocument;
      creatingOffscreenDocument = null;
    }
  }

  async function getAuthFromOffscreen() {
    await setupOffscreenDocument();
    return new Promise((resolve, reject) => {
      browser.runtime.sendMessage({ action: 'getAuth', target: 'offscreen' }, (response) => {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }


  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "signIn") {
      getAuthFromOffscreen()
        .then(async (user: any) => {
          const minimalUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          }
          console.log("User signed in:", user)
          // Authenticate Firebase with the access token
          // if (user.uid) {
          //   await authenticateWithFirebase(user.uid)
          // }

          await browser.storage.local.set({ user: minimalUser });
          
          // // Notify any open popups about the authentication change
          // chrome.runtime.sendMessage({ 
          //   type: 'AUTH_STATE_CHANGED',
          //   user: minimalUser
          // });
          
          
          sendResponse({ user: user })
        })
        .catch(error => {
          console.error("Authentication error:", error)
          sendResponse({ error: error.message })
        })
      return true // Keeps the message channel open for async response
    }

  })









});


browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url?.startsWith("https://accounts.google.com/o/oauth2/auth/") ||
    tab.url?.startsWith("https://<firebase-project-id>.firebaseapp.com")
  ) {
    browser.windows.update(tab.windowId, { focused: true })
    return
  }
})




























