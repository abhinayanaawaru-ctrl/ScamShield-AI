importScripts("rules.js");

const ALLOW_KEY = "allowedHosts";
const ageCache = new Map();

async function isAllowed(host) {
  const s = await chrome.storage.session.get(ALLOW_KEY);
  return (s[ALLOW_KEY] || []).includes(host);
}

// Layer 1: check the address before the page even loads.
chrome.webNavigation.onBeforeNavigate.addListener(async (d) => {
  if (d.frameId !== 0) return;
  let u;
  try { u = new URL(d.url); } catch (e) { return; }
  if (!/^https?:$/.test(u.protocol)) return;

  const r = ScamRules.analyzeUrl(d.url);
  if (!r) return;
  if (r.level !== "black" && (await isAllowed(u.hostname))) return;

  const page = chrome.runtime.getURL("warning.html") + "?" + new URLSearchParams({
    level: r.level, url: d.url, reason: r.reasons.join(" ")
  });
  chrome.tabs.update(d.tabId, { url: page });
});

// Layer 2: domain age lookup (via public RDAP) for the content script.
function registrableDomain(host) {
  const p = host.split(".");
  if (p.length <= 2) return host;
  const secondLevel = ["co", "com", "org", "net", "gov", "ac", "nic"];
  if (p[p.length - 1].length === 2 && secondLevel.includes(p[p.length - 2])) return p.slice(-3).join(".");
  return p.slice(-2).join(".");
}

async function domainAgeDays(host) {
  const domain = registrableDomain(host);
  if (ageCache.has(domain)) return ageCache.get(domain);
  let days = null;
  try {
    const res = await fetch("https://rdap.org/domain/" + domain);
    if (res.ok) {
      const data = await res.json();
      const ev = (data.events || []).find((e) => e.eventAction === "registration");
      if (ev) days = Math.floor((Date.now() - new Date(ev.eventDate).getTime()) / 86400000);
    }
  } catch (e) { /* offline or unsupported TLD: stay silent */ }
  ageCache.set(domain, days);
  return days;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "domainAge") {
    domainAgeDays(msg.host).then((days) => sendResponse({ days }));
    return true; // async response
  }
});
