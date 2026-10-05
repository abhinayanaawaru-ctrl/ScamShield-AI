# 🛡️ ScamShield AI
> A zero-friction digital seatbelt for the internet.

ScamShield AI is built around the **"Lazy User Rule"**: zero clicks on computers and two taps on mobile. It stays silent while you browse and steps in only at the moment of danger.

## Core Features
* **Zero-click desktop extension** (Manifest V3, Chrome/Edge).
* **Three warning levels**
  * 🟡 **Yellow:** brand-new site (under 14 days old, checked via public RDAP) or shop-like keywords. Suggests Cash on Delivery.
  * 🔴 **Red:** high-pressure wording or impossible discounts.
  * ⚫ **Black:** phishing-style addresses or a raw UPI payment trap. No "continue" button.
* **Mobile shortcut:** `mobile/` is an installable web app that appears in the phone's Share Menu.

## Try it locally
1. Unzip the project.
2. Open `chrome://extensions/` in Chrome or Edge.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and pick this folder.

### Demo triggers
Type these in the address bar (they fire before the page loads, so the domain need not exist):
* `http://my-newbaker.com` ➡️ 🟡 Yellow
* `http://super-cheap-store.com` ➡️ 🔴 Red
* `http://win-free-money.com` ➡️ ⚫ Black

## How it works
| File | Job |
|---|---|
| `rules.js` | All detection rules, shared by desktop and mobile |
| `background.js` | Checks each address before load; looks up domain age |
| `content.js` | Scans page text and links; draws the overlay |
| `warning.html/js` | Full-screen warning page for address-based hits |
| `mobile/` | Share-target web app (host over HTTPS, then "Add to Home screen") |

## Limits of this prototype
* Rules are keyword-based, not a trained model. The "AI" part is the next step.
* The UPI check can false-positive on legitimate payment pages.
* Mobile sharing only checks the URL, and needs HTTPS hosting (e.g. GitHub Pages).
