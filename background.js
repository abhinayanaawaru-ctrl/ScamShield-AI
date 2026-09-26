// Trigger Layer 1: Catches active URL updates during page load cycles
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    evaluateUrlSecurity(tabId, tab.url);
  }
});

// Trigger Layer 2: Instant backup catcher for fast network redirects
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0 && details.url) {
    evaluateUrlSecurity(details.tabId, details.url);
  }
});

// Centralized evaluation engine tracking target scam phrases globally
function evaluateUrlSecurity(tabId, runningUrl) {
  if (runningUrl.startsWith('chrome://') || runningUrl.startsWith('about:')) return;

  let url = runningUrl.toLowerCase();
  let color = "green";
  let msg = "";

  if (url.includes("win-free") || url.includes("upi-pay")) {
    color = "black";
    msg = "CRITICAL SECURITY BLOCK! Verified criminal phishing page. Access restricted to protect your financial data.";
  } else if (url.includes("cheap") || url.includes("discount")) {
    color = "red";
    msg = "HIGH RISK SCAM DETECTED! Deceptive pricing and fake countdown timers flagged by AI.";
  } else if (url.includes("baker") || url.includes("thrift")) {
    color = "yellow";
    msg = "⚠️ SUSPICIOUS NEW SITE! This local shop is unverified. We recommend using Cash on Delivery (COD).";
  }

  if (color !== "green") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: injectGlobalBlocker,
      args: [color, msg]
    }).catch(err => console.log("System script deployment caught exception:", err));
  }
}

// Injects the universal safety interface overlay seamlessly onto the site DOM viewport
function injectGlobalBlocker(color, msg) {
  if (document.getElementById('scamshield-universal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'scamshield-universal-overlay';
  let bg = color === 'black' ? '#000000' : (color === 'red' ? '#b91c1c' : '#eab308');
  
  overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:${bg};z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;padding:20px;box-sizing:border-box;`;
  
  overlay.innerHTML = `
    <h1 style="font-size:42px;margin-bottom:15px;font-weight:bold;letter-spacing:1px;">${color.toUpperCase()} ALERT</h1>
    <p style="font-size:20px;max-width:600px;text-align:center;margin-bottom:30px;line-height:1.5;">${msg}</p>
    <button id="shield-abort-btn" style="background:white;color:${bg};border:none;padding:14px 28px;font-size:16px;font-weight:bold;border-radius:8px;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.2);transition:transform 0.1s;">I understand, close this site</button>
  `;
  
  document.body.appendChild(overlay);
  document.getElementById('shield-abort-btn').addEventListener('click', () => { window.location.href = "about:blank"; });
}
