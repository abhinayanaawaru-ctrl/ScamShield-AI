(function () {
  const host = location.hostname;
  if (ScamRules.isTrusted(host)) return;

  const COLORS = {
    yellow: { bg: "#FFF4C2", fg: "#5c4a00", accent: "#F5B800", title: "Suspicious site" },
    red:    { bg: "#7a0c0c", fg: "#ffffff", accent: "#ff4d4d", title: "High risk: likely scam" },
    black:  { bg: "#000000", fg: "#ffffff", accent: "#ff2d2d", title: "Critical: payment trap detected" }
  };

  let shown = null;

  function show(result) {
    if (shown && ScamRules.worst({ level: shown }, result).level === shown) return;
    shown = result.level;
    const old = document.getElementById("scamshield-ai-root");
    if (old) old.remove();

    const c = COLORS[result.level];
    const rootEl = document.createElement("div");
    rootEl.id = "scamshield-ai-root";
    const sh = rootEl.attachShadow({ mode: "closed" });
    const banner = result.level === "yellow";

    sh.innerHTML = `
      <style>
        .wrap { position: fixed; z-index: 2147483647; font-family: system-ui, sans-serif;
          background: ${c.bg}; color: ${c.fg}; box-sizing: border-box; }
        .full { inset: 0; display: flex; align-items: center; justify-content: center; text-align: center; padding: 24px; }
        .bar { top: 0; left: 0; right: 0; padding: 12px 20px; border-bottom: 4px solid ${c.accent}; display: flex; gap: 12px; align-items: center; }
        .card { max-width: 520px; }
        h1 { margin: 0 0 12px; font-size: 28px; }
        p { margin: 6px 0; line-height: 1.5; }
        button { cursor: pointer; border: 0; border-radius: 8px; padding: 10px 18px; font-size: 15px; margin: 12px 6px 0; }
        .safe { background: ${c.accent}; color: #000; font-weight: 600; }
        .ghost { background: transparent; color: inherit; border: 1px solid currentColor; }
        .bar button { margin: 0 0 0 auto; padding: 6px 12px; }
      </style>
      <div class="wrap ${banner ? "bar" : "full"}">
        ${banner ? `
          <span><b>🟡 ${c.title}.</b> ${result.reasons.join(" ")} Prefer Cash on Delivery (COD).</span>
          <button class="ghost" id="dismiss">Dismiss</button>
        ` : `
          <div class="card">
            <h1>${result.level === "red" ? "🔴" : "⚫"} ${c.title}</h1>
            ${result.reasons.map((r) => `<p>${r}</p>`).join("")}
            <p>Do not enter card details, OTPs or UPI PINs here.</p>
            <button class="safe" id="leave">Take me to safety</button>
            ${result.level === "red" ? `<button class="ghost" id="dismiss">I understand the risk</button>` : ""}
          </div>
        `}
      </div>`;

    document.documentElement.appendChild(rootEl);

    const dismiss = sh.getElementById("dismiss");
    if (dismiss) dismiss.onclick = () => { rootEl.remove(); document.documentElement.style.overflow = ""; };
    const leave = sh.getElementById("leave");
    if (leave) leave.onclick = () => { location.href = "about:blank"; };

    if (result.level === "black") {
      try { window.stop(); } catch (e) {}
      document.documentElement.style.overflow = "hidden";
    } else if (result.level === "red") {
      document.documentElement.style.overflow = "hidden";
    }
  }

  function scan() {
    const text = (document.body ? document.body.innerText : "").slice(0, 50000);
    const hrefs = Array.from(document.querySelectorAll("a[href]")).map((a) => a.href);
    const r = ScamRules.analyzePage(text, hrefs);
    if (r) show(r);
  }

  scan();
  setTimeout(scan, 2500); // catch pop-ups and late-loading content

  // Yellow tier: brand-new domains (under 14 days old)
  chrome.runtime.sendMessage({ type: "domainAge", host }, (res) => {
    if (chrome.runtime.lastError || !res || res.days == null) return;
    if (res.days < 14) {
      show({ level: "yellow", reasons: ["This website was registered only " + res.days + " day(s) ago."] });
    }
  });
})();
