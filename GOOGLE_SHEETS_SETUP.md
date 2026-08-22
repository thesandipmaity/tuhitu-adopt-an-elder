# Google Sheets Setup

This repo now supports saving all 5 website forms into one Google Sheet, separated into 5 tabs.

## Tabs

1. `Care Home Registration`
2. `Volunteer Application`
3. `Register Your Organisation`
4. `Start a Sponsor Discussion`
5. `Give A Conversation Somewhere To Begin - PAYMENT`

Note:
Current website copy says `Companion`, but the internal form key is still `volunteer`. The sheet tab name can stay `Volunteer Application` or you can rename it later.

## Files Added

- Apps Script source: [scripts/google-sheets-webapp.gs](/C:/Users/Sandip/Desktop/Project/Tuhitu Elder/scripts/google-sheets-webapp.gs)
- Frontend integration: [public/js/script.js](/C:/Users/Sandip/Desktop/Project/Tuhitu Elder/public/js/script.js)

## What You Need To Change

1. Open your Google Sheet:
   `https://docs.google.com/spreadsheets/d/1VlLWSqmKBXboKT9XYIxYez3sy0eUboNtDlOmXYYG2NU/edit`
2. Open `Extensions -> Apps Script`
3. Paste the contents of [scripts/google-sheets-webapp.gs](/C:/Users/Sandip/Desktop/Project/Tuhitu Elder/scripts/google-sheets-webapp.gs)
4. In that file, replace:
   `PASTE_YOUR_SPREADSHEET_ID_HERE`
   with:
   `1VlLWSqmKBXboKT9XYIxYez3sy0eUboNtDlOmXYYG2NU`
5. Run `initializeSheets()` once from Apps Script editor
6. Deploy as:
   `Deploy -> New deployment -> Web app`
7. Set access to:
   `Anyone`
8. Copy the web app URL
9. In [public/js/script.js](/C:/Users/Sandip/Desktop/Project/Tuhitu Elder/public/js/script.js), replace:
   `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
   with your deployed Apps Script URL

## Header Mapping

The Apps Script does not require exact header format.

These all map to the same key:

- `firstName`
- `First Name`
- `first_name`
- `first-name`

Same behavior works for all fields like:

- `targetGeography` -> `Target Geography`
- `preferredTimeline` -> `Preferred Timeline`
- `donationFrequency` -> `Donation Frequency`

If a new field comes later, the Apps Script automatically adds a new column.

## Form Fields

### 1. Care Home Registration

- `submissionType`
- `organisation`
- `organisationType`
- `fullName`
- `contactRole`
- `email`
- `phone`
- `country`
- `targetGeography`
- `elderCount`
- `licenceStatus`
- `safeguardingReadiness`
- `consentReadiness`
- `engagementModel`
- `preferredTimeline`
- `message`
- `consent`
- `language`
- `sourceUrl`
- `reference`

### 2. Volunteer Application

- `submissionType`
- `fullName`
- `email`
- `phone`
- `country`
- `contactRole`
- `targetGeography`
- `availability`
- `interestArea`
- `message`
- `consent`
- `language`
- `sourceUrl`
- `reference`

### 3. Register Your Organisation

- `submissionType`
- `fullName`
- `email`
- `phone`
- `country`
- `organisation`
- `contactRole`
- `organisationType`
- `targetGeography`
- `elderCount`
- `engagementModel`
- `preferredTimeline`
- `message`
- `consent`
- `language`
- `sourceUrl`
- `reference`

### 4. Start a Sponsor Discussion

- `submissionType`
- `fullName`
- `email`
- `phone`
- `country`
- `organisation`
- `contactRole`
- `interestArea`
- `targetGeography`
- `supportRange`
- `preferredTimeline`
- `message`
- `consent`
- `language`
- `sourceUrl`
- `reference`

### 5. Give A Conversation Somewhere To Begin - PAYMENT

- `sheetKey`
- `fullName`
- `email`
- `phone`
- `country`
- `donationFrequency`
- `donationAmount`
- `customDonationAmount`
- `donationCurrency`
- `consent`
- `sourceUrl`
- `reference`
- `gatewayReady`
- `gatewayStatus`

## Behavior Now

- `Volunteer`, `Care Home`, `Partner`, and `Sponsor` forms save to backend first, then also send to Google Sheet.
- `Donation checkout` sends payment request as before, and also logs the request to the payment tab.
- If the Google Sheet URL is not configured, website form submission still continues through the existing backend flow.
