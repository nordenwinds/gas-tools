import { config } from '../config';
import { CalendarService } from './Services/CalendarService';
import { FormService } from './Services/FormService';
import { LineNotifyService } from './Services/LineNotifyService';
import { SpreadsheetService } from './Services/SpreadsheetService';

function handler(): void {
  /**
   * @var {Date} targetDate  処理対象の日付
   */
  const targetDate: Date = new Date();
  targetDate.setDate(new Date().getDate() + config.calendar.targetDay);

  //
  // キーワードを含む予定を探す
  //
  const calendarService: CalendarService = new CalendarService(
    config.calendar.id
  );

  const events = calendarService.findEventsByName(
    targetDate,
    config.calendar.keyword
  );

  if (events.length <= 0) {
    console.info(`No events found. Do nothing.`);
    return;
  }

  //
  // 新しいフォームを作成する
  //
  const formService: FormService = new FormService(config.form.id);

  const form: GoogleAppsScript.Forms.Form = formService.copy(targetDate);
  form.setDestination(
    FormApp.DestinationType.SPREADSHEET,
    config.spreadsheet.id
  );

  //
  // シートの名前を変更する
  //
  const spreadsheetService: SpreadsheetService = new SpreadsheetService(
    config.spreadsheet.id
  );
  spreadsheetService.newSheet(targetDate);

  //
  // 出欠確認メッセージをLINEに送る
  //
  const lineNotifyService: LineNotifyService = new LineNotifyService(
    config.line.webhookUrl,
    config.line.webhookToken
  );

  /**
   * @var {string} message  LINEで送信するメッセージ
   */
  const message = `
来週は練習があります！
詳細は以下の通りです。
フォームから出欠予定を「全員」回答してください！
${form.getPublishedUrl()}
回答状況はコチラ👇
https://docs.google.com/spreadsheets/d/${config.spreadsheet.id}/
-----
${events[0].getTitle()}
${targetDate.toLocaleDateString('ja-JP')}
${events[0].getStartTime().toLocaleTimeString()} - ${events[0]
    .getEndTime()
    .toLocaleTimeString()}
${events[0].getLocation()}
`;

  lineNotifyService.send(message);
}
