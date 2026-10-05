// Shared detection rules (used by the extension and the mobile share page).
(function (root) {
  const URL_KEYWORDS = {
    black: ["win-free", "upi-pay"],
    red: ["cheap", "discount"],
    yellow: ["baker", "thrift"]
  };

  const PRESSURE_WORDS = [
    "act now", "hurry", "limited time", "last chance", "only 1 left", "only 2 left",
    "only 3 left", "offer ends in", "expires in", "today only", "congratulations you won",
    "claim your prize", "pay now to confirm", "don't miss out", "selling fast"
  ];

  const TRUSTED = ["google.com", "amazon.in", "amazon.com", "flipkart.com", "wikipedia.org",
    "github.com", "youtube.com", "claude.ai", "anthropic.com"];

  const UPI_HANDLES = "oksbi|okhdfc|okicici|okaxis|ybl|ibl|axl|paytm|upi|apl|sbi|hdfcbank|icici";
  const UPI_ID_RE = new RegExp("\\b[\\w.\\-]{2,}@(" + UPI_HANDLES + ")\\b", "i");

  function isTrusted(host) {
    return TRUSTED.some((d) => host === d || host.endsWith("." + d));
  }

  // URL-only check. Returns {level, reasons} or null.
  function analyzeUrl(url) {
    const lower = String(url).toLowerCase();
    let host = "";
    try { host = new URL(lower).hostname; } catch (e) {}
    if (host && isTrusted(host)) return null;
    for (const level of ["black", "red", "yellow"]) {
      const hit = URL_KEYWORDS[level].find((k) => lower.includes(k));
      if (hit) {
        const why = {
          black: "The address contains \"" + hit + "\", a pattern used in prize and direct-UPI payment traps.",
          red: "The address contains \"" + hit + "\", common on fake bargain stores.",
          yellow: "The address contains \"" + hit + "\". Small new shops like this are often fake; check carefully."
        }[level];
        return { level, reasons: [why] };
      }
    }
    return null;
  }

  // Page-content check. hrefs = array of link URLs, text = visible text.
  function analyzePage(text, hrefs) {
    const t = String(text || "").toLowerCase();
    const reasons = [];

    if ((hrefs || []).some((h) => /^upi:\/\//i.test(h)) || UPI_ID_RE.test(text || "")) {
      reasons.push("This page asks you to pay straight to a UPI ID or UPI link.");
      return { level: "black", reasons };
    }

    const pressure = PRESSURE_WORDS.filter((w) => t.includes(w));
    const bigDiscount = /\b(8\d|9\d|100)\s?%\s?(off|discount)/i.test(t);
    if (pressure.length >= 2) reasons.push("High-pressure wording: \"" + pressure.slice(0, 3).join("\", \"") + "\".");
    if (bigDiscount) reasons.push("Impossible-looking discount (80%+ off).");
    if (pressure.length >= 2 || (pressure.length >= 1 && bigDiscount)) {
      if (!reasons.length) reasons.push("Pressure tactics combined with an unrealistic price.");
      return { level: "red", reasons };
    }
    return null;
  }

  const rank = { yellow: 1, red: 2, black: 3 };
  function worst(a, b) {
    if (!a) return b;
    if (!b) return a;
    return rank[b.level] > rank[a.level] ? b : a;
  }

  root.ScamRules = { analyzeUrl, analyzePage, isTrusted, worst };
})(typeof self !== "undefined" ? self : this);
