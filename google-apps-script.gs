/**
 * RSVP → Google Sheet backend for the Sachindra & Stuti wedding site.
 *
 * Setup (see README.md for the full walkthrough):
 * 1. Create a Google Sheet.
 * 2. Extensions → Apps Script → paste this whole file, replacing any starter code.
 * 3. Deploy → New deployment → type "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL and paste it into SCRIPT_URL in index.html.
 */

var SHEET_NAME = "RSVPs";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // avoid clashing writes if two guests reply at once

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Name", "Phone", "Attendance", "Remark"]);
      sheet.getRange("A1:E1").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      p.name || "",
      p.phone || "",
      p.attendance || "",
      p.remark || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Optional: visiting the web app URL in a browser shows a simple health check.
function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is live.");
}
