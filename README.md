# Gemstone Rewards V3

## What changed

- Premium black-and-gold responsive design
- Separate customer pages:
  - Dashboard
  - Gemstones
  - Wallet
  - Withdraw
  - History
  - Profile
- No admin button or admin link on the customer website
- Hidden admin filename: `portal-4mK9X-admin.html`
- Multiple active gemstone subscriptions
- Separate 24-hour claim timer for each subscription
- Add Funds button opens a form with only:
  - Amount
  - GCash or Maya
  - Reference number
- No proof URL
- Point withdrawals remain subject to administrator approval

## Important

A hidden admin URL is not complete security. The admin page still requires its username and password. Keep the URL private.

## Step 1 — Update Google Apps Script

1. Back up your existing Google Sheet.
2. Open your Google Apps Script project.
3. Open `Code.gs` from this V3 package.
4. Delete the old Apps Script code.
5. Paste the V3 `Code.gs`.
6. Save.
7. Select `setup` and click Run.
8. Wait for `Execution completed`.
9. Open **Deploy → Manage deployments**.
10. Edit the current deployment.
11. Select **New version**.
12. Deploy.
13. Copy the Web App URL ending in `/exec`.

Running `setup()` keeps the existing sheets and adds any missing sheet needed by the program.

## Step 2 — Configure the website

Open `config.js` and replace:

```javascript
API_URL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
```

with your real `/exec` URL.

Also replace:

```javascript
GCASH_NUMBER: "09XXXXXXXXX"
GCASH_NAME: "Your GCash Name"
MAYA_NUMBER: "09XXXXXXXXX"
MAYA_NAME: "Your Maya Name"
```

with your actual receiving details.

## Step 3 — Update GitHub

Upload all these files to the root of your GitHub repository:

- `index.html`
- `login.html`
- `register.html`
- `dashboard.html`
- `gemstones.html`
- `wallet.html`
- `withdraw.html`
- `history.html`
- `profile.html`
- `portal-4mK9X-admin.html`
- `styles.css`
- `config.js`
- `public.js`
- `auth.js`
- `customer.js`
- `admin.js`
- `README.md`

Do not upload `Code.gs` as part of the public website.

Commit the changes, wait a few minutes, and hard refresh the site with `Ctrl + F5`.

## Step 4 — Test in order

1. Register a new customer.
2. Log in.
3. Open Profile and verify the customer details.
4. Open Wallet and click Add Funds.
5. Submit a test amount, method, and reference.
6. Open the hidden admin URL and approve the deposit.
7. Refresh the Wallet page.
8. Open Gemstones and activate two subscriptions if the wallet has enough funds.
9. Confirm that each subscription has its own timer.
10. Submit a test withdrawal.
11. Approve or reject it from the admin page.

## URLs

Customer site:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

Hidden admin site:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/portal-4mK9X-admin.html`
