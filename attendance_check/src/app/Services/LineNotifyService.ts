import { URL } from '../../utils/URL';

type RequestHeader = {
  Authorization: string;
};

type Payload = {
  message: string;
};

export class LineNotifyService {
  constructor(private readonly url: string, private readonly token: string) {}

  /**
   * LINE NotifyでLINEにメッセージを送る
   *
   * 送付先はLINE Notifyで生成したTokenに紐付けられる
   *
   * @param {string} message  LINEに送信する内容
   *
   * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse}
   */
  public send(message: string): GoogleAppsScript.URL_Fetch.HTTPResponse {
    const header: RequestHeader = {
      Authorization: `Bearer ${this.token}`,
    };

    const payload: Payload = {
      message: message,
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      payload: URL.buildQueryString(payload),
      headers: header,
    };

    console.info(`LineNotifyService: Send a request to ${this.url} .`, {
      options,
    });
    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(
      this.url,
      options
    );

    return response;
  }
}
