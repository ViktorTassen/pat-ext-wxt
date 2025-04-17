const HOSTING_URL = "https://pat-web-theta.vercel.app/sign-in-popup";
let iframe = document.querySelector('iframe#auth-iframe') as HTMLIFrameElement;

if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'auth-iframe';
    iframe.src = HOSTING_URL;
    iframe.style.display = 'none'; // hide iframe
    document.body.appendChild(iframe);
}

function handleIframeMessage(event: MessageEvent) {
    try {
        if (event.origin !== new URL(HOSTING_URL).origin) return; // ✅ Only accept from trusted origin
        const { data } = event;

        if (!data || typeof data !== 'string' || !data.startsWith('{"user"')) return;

        const parsedData = JSON.parse(data);
        window.removeEventListener('message', handleIframeMessage);
        pendingSendResponse?.(parsedData.user);
        pendingSendResponse = null;
    } catch (e) {
        console.error('Error parsing iframe message:', e);
    }
}

let pendingSendResponse: ((response?: any) => void) | null = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getAuth' && message.target === 'offscreen') {
        pendingSendResponse = sendResponse;

        window.addEventListener('message', handleIframeMessage);

        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({ initAuth: true }, new URL(HOSTING_URL).origin);
        } else {
            console.error('iframe.contentWindow is null');
        }

        return true; // Asynchronous response
    }
});
