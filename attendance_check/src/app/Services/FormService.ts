export class FormService {
  private readonly baseForm: GoogleAppsScript.Drive.File;

  constructor(private readonly formId: string) {
    this.baseForm = DriveApp.getFileById(formId);
  }

  public copy(targetDate: Date): GoogleAppsScript.Forms.Form {
    const date: string = Utilities.formatDate(targetDate, 'JST', 'YYYMMdd');
    const formName = `${date}_出欠`;

    console.info(`FormService: Make copy '${formName}'.`);
    const copiedFile: GoogleAppsScript.Drive.File = this.baseForm.makeCopy(formName);
    const copiedForm: GoogleAppsScript.Forms.Form = FormApp.openById(copiedFile.getId());

    copiedForm.setTitle(`${date} 練習出欠`).setDescription('練習の出欠を取ります！');

    return copiedForm;
  }
}
