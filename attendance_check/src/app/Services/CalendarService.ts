export class CalendarService {
  private readonly calendar: GoogleAppsScript.Calendar.Calendar;

  constructor(private readonly calendarId: string) {
    this.calendar = CalendarApp.getCalendarById(calendarId);
  }

  /**
   * 指定した日付の予定からキーワードを含む予定を抽出する
   *
   * @param {Date} targetDate
   * @param {string} keyword
   *
   * @returns {GoogleAppsScript.Calendar.CalendarEvent[]}
   */
  public findEventsByName(targetDate: Date, keyword: string): GoogleAppsScript.Calendar.CalendarEvent[] {
    const events: GoogleAppsScript.Calendar.CalendarEvent[] = this.calendar.getEventsForDay(targetDate);

    if (events.length <= 0) {
      console.info(`CalendarService: No events found on ${targetDate.toLocaleDateString()}.`);
      return events;
    }

    console.info(`CalendarService: Search event where has '${keyword}' on its title.`);
    const aimedEvents: GoogleAppsScript.Calendar.CalendarEvent[] = events.filter(
      (event: GoogleAppsScript.Calendar.CalendarEvent): boolean => event.getTitle().indexOf(keyword) > -1
    );

    return aimedEvents;
  }
}
