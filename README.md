# 🛡️ ScamShield AI
> A zero-friction digital seatbelt for the internet. Built for the Ignite 1% Hackathon.

ScamShield AI is an automatic digital safety net built around the **"Lazy User Rule"** (requiring zero clicks on computers and exactly two taps on mobile phones). It sits completely silent and invisible while you browse normally, stepping in to block financial fraud right at the millisecond of danger.

## 🧰 Core Features
* **Zero-Click Computer Extension:** Runs silently in the background of your browser.
* **Three-Color Warning Levels:**
  * 🟡 **Yellow (Suspicious Alert):** Flags brand-new websites (under 14 days old). Warns users to use Cash on Delivery (COD).
  * 🔴 **Red (High Risk):** Blocks the screen if a site uses aggressive high-pressure trick words or impossible pricing matrices.
  * ⚫ **Black (Critical Block):** Freezes the page completely if a verified criminal phishing clone or direct raw UPI trap is exposed.
* **Frictionless Mobile Shortcut:** Hooks directly into the smartphone's native Share Menu.

## 🛠️ How to Test the Prototype Locally (Try it out!)
You can load this extension into your browser in less than 60 seconds:
1. Download this repository as a ZIP file to your computer and unzip it.
2. Open Google Chrome or Microsoft Edge and navigate to `chrome://extensions/`.
3. Turn on the **"Developer mode"** toggle switch in the top-right corner.
4. Click the **"Load unpacked"** button in the top-left corner and select this project folder.

### 🧪 Test Triggers for Demo:
Open a blank browser tab and type these phrases into your URL bar to see the automated 3-color tiers fire live:
* Open any site with `baker` or `thrift` in the URL (e.g., `http://my-newbaker.com`) ➡️ **Triggers 🟡 Yellow Alert**
* Open any site with `cheap` or `discount` in the URL (e.g., `http://super-cheap-store.com`) ➡️ **Triggers 🔴 Red Blocker**
* Open any site with `win-free` or `upi-pay` in the URL (e.g., `http://win-free-money.com`) ➡️ **Triggers ⚫ Black Critical Block**
