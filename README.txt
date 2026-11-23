JIRHU FRESH – PWA STARTER PACKAGE
=================================

This starter app is designed for:
- JIRHU fresh – Quality Product
- WhatsApp order destination: +91 6002810234
- English language and Indian Rupees
- Home delivery (free initially) or shop pickup
- Android-installable website (PWA)

IMPORTANT BEFORE GOING LIVE
---------------------------
1. Product prices in products.js are SAMPLE prices. Change every price to your current selling price.
2. The first version uses a static product list. It does not have a live stock database, admin dashboard, automatic payments, delivery tracking or order history.
3. The customer sends an order to your WhatsApp. You must confirm availability and final total yourself.
4. Keep the WhatsApp number in app.js correct. It is currently 916002810234.
5. Product emoji are placeholders. Replace them with your own genuine product photos later if desired.

PUBLISH FREE USING GITHUB PAGES
-------------------------------
You can do this from your Android phone using Chrome.

A. Create/sign in to GitHub at https://github.com/
B. Create a NEW PUBLIC repository named: jirhu-fresh
C. Extract this ZIP on a computer, or use a ZIP/file manager on Android.
D. Upload the CONTENTS of this folder to the ROOT of the repository:
   index.html, style.css, app.js, products.js, manifest.json,
   service-worker.js, README.txt and the icons folder.
   Do not upload the outer folder as an extra nested folder.
E. In GitHub repository, open Settings > Pages.
F. Under Build and deployment, select "Deploy from a branch".
G. Select branch "main" and folder "/ (root)", then Save.
H. Wait for GitHub Pages to publish. Your URL will look like:
   https://YOUR-GITHUB-USERNAME.github.io/jirhu-fresh/
I. Open that HTTPS address in Chrome on Android.
J. Use the browser menu (three dots) > Install app or Add to Home screen.

TEST BEFORE SHARING
-------------------
1. Add two or three products to cart.
2. Open cart and check quantities and subtotal.
3. Continue to checkout.
4. Test both Home delivery and Shop pickup.
5. Send a test order to your own WhatsApp number.
6. Check that the message contains customer details and item totals.

EDIT PRODUCT PRICES / STOCK
---------------------------
Open products.js and edit the sample products.
Each product uses:
{id:"unique-id", name:"Tomato", category:"Vegetables",
 price:40, unit:"kg", emoji:"🍅", description:"Fresh and ripe"}

To remove a product, delete its object from the PRODUCTS array.
To add a product, copy one object and give it a new unique id.
For stock control, the starter currently assumes all listed products are available.
After editing, upload/replace products.js in GitHub.

FREE HOSTING NOTES
------------------
GitHub Pages is free for public repositories and supports HTTPS.
A custom .com domain is optional and is not included in this starter.
This is a PWA website, not a Play Store-published Android APK.
The app shell can load offline after the first successful visit, but WhatsApp checkout requires internet.
