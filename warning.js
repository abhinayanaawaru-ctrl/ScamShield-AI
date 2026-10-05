const q = new URLSearchParams(location.search);
const level = ["yellow", "red", "black"].includes(q.get("level")) ? q.get("level") : "red";
const target = q.get("url") || "";
document.body.className = level;

const titles = {
  yellow: "🟡 Suspicious website",
  red: "🔴 High risk: likely scam",
  black: "⚫ Critical block"
};
const tips = {
  yellow: "If you still buy, choose Cash on Delivery (COD) and never pay in advance.",
  red: "Do not enter card details, OTPs or UPI PINs on this site.",
  black: "This page is blocked completely to protect your money."
};

document.getElementById("title").textContent = titles[level];
document.getElementById("reason").textContent = q.get("reason") || "";
document.getElementById("tip").textContent = tips[level];
document.getElementById("url").textContent = target;

document.getElementById("safe").onclick = () => { location.href = "about:blank"; };

const go = document.getElementById("go");
if (level !== "black") {
  go.hidden = false;
  go.onclick = async () => {
    const host = new URL(target).hostname;
    const s = await chrome.storage.session.get("allowedHosts");
    const list = s.allowedHosts || [];
    if (!list.includes(host)) list.push(host);
    await chrome.storage.session.set({ allowedHosts: list });
    location.href = target;
  };
}
