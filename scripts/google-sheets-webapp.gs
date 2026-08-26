const SPREADSHEET_ID = '1S2pFrBMJhV2PibnFpsA7JdFnqUyeXMdOqAm5DCiquHw';

const TAB_CONFIG = {
  volunteer: {
    sheetName: 'Volunteer Application',
    defaultHeaders: [
      'Submitted At',
      'Reference',
      'Submission Type',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Contact Role',
      'Target Geography',
      'Availability',
      'Interest Area',
      'Message',
      'Consent',
      'Language',
      'Source Url',
    ],
  },
  'care-home': {
    sheetName: 'Care Home Registration',
    defaultHeaders: [
      'Submitted At',
      'Reference',
      'Submission Type',
      'Organisation',
      'Organisation Type',
      'Full Name',
      'Contact Role',
      'Email',
      'Phone',
      'Country',
      'Target Geography',
      'Elder Count',
      'Licence Status',
      'Safeguarding Readiness',
      'Consent Readiness',
      'Engagement Model',
      'Preferred Timeline',
      'Message',
      'Consent',
      'Language',
      'Source Url',
    ],
  },
  partner: {
    sheetName: 'Register Your Organisation',
    defaultHeaders: [
      'Submitted At',
      'Reference',
      'Submission Type',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Organisation',
      'Contact Role',
      'Organisation Type',
      'Target Geography',
      'Elder Count',
      'Engagement Model',
      'Preferred Timeline',
      'Message',
      'Consent',
      'Language',
      'Source Url',
    ],
  },
  sponsor: {
    sheetName: 'Start a Sponsor Discussion',
    defaultHeaders: [
      'Submitted At',
      'Reference',
      'Submission Type',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Organisation',
      'Contact Role',
      'Interest Area',
      'Target Geography',
      'Support Range',
      'Preferred Timeline',
      'Message',
      'Consent',
      'Language',
      'Source Url',
    ],
  },
  'elder-registration': {
    sheetName: 'Elder Registration',
    defaultHeaders: [
      'Submitted At',
      'Reference',
      'Submission Type',
      'Full Name',
      'Age',
      'Gender',
      'Phone',
      'Registration For',
      'Preferred Language',
      'City',
      'Other City',
      'Locality',
      'Living Arrangement',
      'Companionship Type',
      'Emergency Contact Name',
      'Emergency Contact Number',
      'Consent',
      'Language',
      'Source Url',
    ],
  },
  newsletter: {
    sheetName: 'Newsletter Subscriptions',
    defaultHeaders: [
      'Submitted At',
      'Sheet Key',
      'Email',
      'Language',
      'Source Url',
      'Website',
    ],
  },
  'donation-payment': {
    sheetName: 'Give A Conversation Somewhere To Begin - PAYMENT',
    defaultHeaders: [
      'Submitted At',
      'Reference',
      'Sheet Key',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Donation Frequency',
      'Donation Amount',
      'Custom Donation Amount',
      'Donation Currency',
      'Gateway Ready',
      'Gateway Status',
      'Consent',
      'Source Url',
    ],
  },
};

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const key = resolveSheetKey_(payload);
    const config = TAB_CONFIG[key];

    if (!config) {
      return jsonResponse_({
        ok: false,
        error: `Unsupported sheet key: ${key || 'missing'}`,
      });
    }

    const flattened = flattenPayload_(payload);
    flattened.submittedAt = new Date().toISOString();
    if (!flattened.sheetKey) flattened.sheetKey = key;

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(spreadsheet, config.sheetName);
    const headers = ensureHeaders_(sheet, config.defaultHeaders, Object.keys(flattened));
    appendRow_(sheet, headers, flattened);

    return jsonResponse_({ ok: true, sheet: config.sheetName });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function initializeSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  Object.keys(TAB_CONFIG).forEach((key) => {
    const config = TAB_CONFIG[key];
    const sheet = getOrCreateSheet_(spreadsheet, config.sheetName);
    ensureHeaders_(sheet, config.defaultHeaders, []);
  });
}

function parsePayload_(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Payload must be a JSON object.');
  }

  return parsed;
}

function resolveSheetKey_(payload) {
  const candidates = [
    payload.sheetKey,
    payload.submissionType,
    payload.formType,
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const normalized = normalizeKey_(candidates[i]);
    if (!normalized) continue;

    const matchedKey = Object.keys(TAB_CONFIG).find((key) => normalizeKey_(key) === normalized);
    if (matchedKey) return matchedKey;
  }

  return '';
}

function flattenPayload_(payload) {
  const flat = {};

  Object.keys(payload).forEach((key) => {
    if (key === 'details') return;
    flat[key] = formatValue_(payload[key]);
  });

  const details = payload.details;
  if (details && typeof details === 'object' && !Array.isArray(details)) {
    Object.keys(details).forEach((key) => {
      flat[key] = formatValue_(details[key]);
    });
  }

  return flat;
}

function formatValue_(value) {
  if (value === null || typeof value === 'undefined') return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value).trim();
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeaders_(sheet, defaultHeaders, incomingKeys) {
  const existingWidth = Math.max(sheet.getLastColumn(), 1);
  let headers = sheet.getRange(1, 1, 1, existingWidth).getValues()[0].filter(Boolean);

  if (!headers.length) {
    headers = defaultHeaders.slice();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  const headerMap = buildHeaderMap_(headers);
  const missingHeaders = [];

  incomingKeys.forEach((key) => {
    if (!key) return;
    const normalized = normalizeKey_(key);
    if (!normalized || headerMap[normalized]) return;
    const label = prettifyKey_(key);
    missingHeaders.push(label);
    headerMap[normalized] = label;
  });

  if (missingHeaders.length) {
    headers = headers.concat(missingHeaders);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return headers;
}

function appendRow_(sheet, headers, data) {
  const normalizedData = {};
  Object.keys(data).forEach((key) => {
    normalizedData[normalizeKey_(key)] = data[key];
  });

  const row = headers.map((header) => {
    const normalizedHeader = normalizeKey_(header);
    return Object.prototype.hasOwnProperty.call(normalizedData, normalizedHeader)
      ? normalizedData[normalizedHeader]
      : '';
  });

  sheet.appendRow(row);
}

function buildHeaderMap_(headers) {
  const map = {};
  headers.forEach((header) => {
    map[normalizeKey_(header)] = header;
  });
  return map;
}

function normalizeKey_(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function prettifyKey_(key) {
  return String(key || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
