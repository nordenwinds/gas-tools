export class SpreadsheetService {
  private readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

  constructor(private readonly spreadsheetId: string) {
    this.spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    this.sheet = this.spreadsheet.getActiveSheet();
  }

  public newSheet(targetDate: Date): void {
    const date: string = Utilities.formatDate(targetDate, 'JST', 'YYYYMMdd');

    const sheetName: string = `${date}出欠`;

    console.info(`SpreadsheetService: Create new sheet '${sheetName}'.`);
    this.sheet.setName(sheetName);
  }
}
