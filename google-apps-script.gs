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

// Visiting the web app URL in a browser shows a health check, plus which
// spreadsheet this script is writing to and how many replies it holds.
function doGet() {
  var out = { status: "RSVP endpoint is live" };
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      out.problem = "Script is NOT attached to any spreadsheet (standalone script).";
    } else {
      out.spreadsheetName = ss.getName();
      out.spreadsheetUrl = ss.getUrl();
      var sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        out.replyCount = 0;
        out.note = "No '" + SHEET_NAME + "' tab yet - it is created on the first reply.";
      } else {
        out.replyCount = Math.max(0, sheet.getLastRow() - 1);
        if (sheet.getLastRow() > 1) {
          out.latestReply = sheet.getRange(sheet.getLastRow(), 1, 1, 5).getDisplayValues()[0];
        }
      }
    }
  } catch (err) {
    out.problem = String(err);
  }
  return ContentService
    .createTextOutput(JSON.stringify(out, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
