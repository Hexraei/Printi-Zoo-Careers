/**
 * Printi Zoo hiring form handler.
 *
 * SETUP (one-time):
 * 1. Create a Google Sheet. Add 5 tabs with these EXACT names, each with a
 *    header row: Timestamp | Name | Phone | Email | Portfolio | Message
 *      - Flutter App Developer
 *      - Backend Developer
 *      - UI-UX Designer
 *      - QA-Testing Engineer
 *      - DevOps-Cloud Engineer
 * 2. In the Sheet, open Extensions > Apps Script.
 * 3. Delete the default code and paste this whole file in.
 * 4. Click Deploy > New deployment.
 *      - Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web app URL you're given.
 * 6. Open assets/site.js and paste that URL into APPS_SCRIPT_URL.
 *
 * Every application submitted on the website lands as a new row in the
 * matching tab below, all in this one spreadsheet.
 */

var ROLE_SHEETS = {
  'flutter-app-developer': 'Flutter App Developer',
  'backend-developer': 'Backend Developer',
  'ui-ux-designer': 'UI-UX Designer',
  'qa-testing-engineer': 'QA-Testing Engineer',
  'devops-cloud-engineer': 'DevOps-Cloud Engineer'
};

function doPost(e) {
  var result = { ok: false };

  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = ROLE_SHEETS[data.role];
    if (!sheetName) {
      throw new Error('Unrecognised role: ' + data.role);
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('No tab named "' + sheetName + '" was found. Check step 1 of the setup notes.');
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.portfolio || '',
      data.message || ''
    ]);

    result.ok = true;
  } catch (err) {
    result.error = err.message;
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
