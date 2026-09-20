/**
 * The lead sheet.
 *
 * Paste this into Extensions > Apps Script on the Google Sheet that holds the
 * enquiries, then Deploy > New deployment > Web app, with:
 *
 *   Execute as         Me
 *   Who has access     Anyone
 *
 * "Anyone" sounds open, and it is worth understanding rather than fearing.
 * The deployment URL is long and random, it is the only way in, and the script
 * below only ever appends a row. Nothing can read the sheet through it. That
 * URL then goes into Vercel as LEAD_SHEET_URL, which the site posts to after
 * an enquiry has already been emailed.
 *
 * The email remains the record of truth. This sheet exists so the owner has
 * one list to work rather than an inbox to search: the columns after the ones
 * the site fills are his own, and nothing here ever writes to them.
 */

/** The fields the site sends, in the order they appear across the sheet. */
var FIELDS = [
  "receivedAt",
  "name",
  "phone",
  "email",
  "intent",
  "area",
  "message",
  "locale",
  "sourcePage",
  "formLocation",
  "gclid",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "landingPage",
  "referrer",
];

/** What those fields are called for a human reading the sheet. */
var HEADERS = [
  "Received (IST)",
  "Name",
  "Phone",
  "Email",
  "Looking to",
  "Area",
  "Message",
  "Language",
  "Page",
  "Form",
  "Google click id",
  "Source",
  "Medium",
  "Campaign",
  "Content",
  "Term",
  "Landing page",
  "Referrer",
];

/**
 * The owner's own columns, added once when the sheet is first set up.
 * The append below never touches them, so a status typed in column T stays
 * put no matter how many enquiries arrive afterwards.
 */
var OWNER_HEADERS = ["Status", "Next action", "Follow up on", "Outcome", "Notes"];

function doPost(e) {
  try {
    var lead = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      setUpHeaders_(sheet);
    }

    var row = FIELDS.map(function (field) {
      var value = lead[field];
      if (value === undefined || value === null) return "";
      if (field === "receivedAt") return toIst_(value);
      return String(value);
    });

    sheet.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    // The site ignores this body, but a readable error helps when testing the
    // deployment by hand.
    return json_({ ok: false, error: String(err) });
  }
}

/** A quick way to confirm the deployment is live by opening the URL. */
function doGet() {
  return json_({ ok: true, message: "Lead sheet is listening." });
}

function setUpHeaders_(sheet) {
  var all = HEADERS.concat(OWNER_HEADERS);
  sheet.getRange(1, 1, 1, all.length).setValues([all]).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setBackground("#f3ede6");
  sheet.getRange(1, HEADERS.length + 1, 1, OWNER_HEADERS.length).setBackground("#e8eef7");
}

/**
 * The site sends an ISO timestamp in UTC. Mumbai is what the owner thinks in,
 * so it is converted once here rather than in his head every time.
 */
function toIst_(iso) {
  var date = new Date(iso);
  if (isNaN(date.getTime())) return String(iso);
  return Utilities.formatDate(date, "Asia/Kolkata", "dd MMM yyyy, HH:mm");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
