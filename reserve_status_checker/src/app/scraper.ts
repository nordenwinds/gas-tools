import { config } from '../config';

/**
 * @typedef {LoginPayload} ログイン時に送信するPayload
 */
type LoginPayload = GoogleAppsScript.URL_Fetch.Payload & {
  torokuno: string;
  ansyono: string;
  g_kinonaiyo: number;
  g_sessionid: string;
};

/**
 * @typedef {RequestHeaders} RequestHeader
 */
type RequestHeaders = {
  Cookie?: string;
  ['Content-Type']?: string;
};

/**
 * @typedef {ResponseHeaders} ResponseHeader
 */
type ResponseHeaders = {
  'Set-Cookie'?: string;
};

export class Scraper {
  private sessionId!: string;
  private cookie!: string;
  private readonly kinonaiyo: number;
  /**
   * @constructor
   * @param {string} id  ユーザID
   * @param {string} password  パスワード
   * @param {string} baseUrl  サイトのURL
   * @param {string} charSet  サイトの文字コード
   */
  constructor(
    private readonly id: string,
    private readonly password: string,
    private readonly baseUrl: string = config['baseUrl'],
    private readonly charSet: string = config['charSet']
  ) {
    this.kinonaiyo = 8;
  }

  /**
   * ログインする
   *
   * Cookieを取得してインスタンス変数に保存する
   *
   * @returns {void}
   */
  public login(): void {
    this.startSession();
    this.updateCookie();

    const url: string = this.baseUrl + 'cultos/reserve/gin_login';

    const headers: RequestHeaders = {
      Cookie: this.cookie,
      ['Content-Type']: 'application/x-www-form-urlencoded',
    };

    const payload: LoginPayload = {
      torokuno: this.id,
      ansyono: this.password,
      g_kinonaiyo: this.kinonaiyo,
      g_sessionid: this.sessionId,
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      payload: payload,
      headers: headers,
      followRedirects: false,
    };

    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url, options);

    const responseBody: string = response.getContentText(config['charSet']);
    console.log(responseBody);

    // const headers: ResponseHeaders = response.getHeaders();
    // this.cookie = headers['Set-Cookie'];
  }

  /**
   * セッションを開始する
   *
   * セッションIDを取得してインスタンス変数に保存する
   *
   * @returns {void}
   */
  private startSession(): void {
    const url: string = this.baseUrl + 'cultos/reserve/gin_init2';

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'get',
      followRedirects: false,
    };

    console.info(`Send a request to: ${url}`, { options });
    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url, options);
    console.log(response.getContentText(config['charSet']));

    const responseBody: string = response.getContentText(config['charSet']);
    const iframeAttr: string = this.parseText(responseBody, '<iframe id="PageMain"', '</iframe>');
    const sessionId: string = this.parseText(iframeAttr, 'g_sessionid=', '"');

    console.info(`Start session with ${sessionId}`);
    this.sessionId = sessionId;

    const responseHeader: ResponseHeaders = response.getHeaders();
    const cookie: string | undefined = responseHeader['Set-Cookie'];
    if (!cookie) throw new Error('Failed to get cookie');

    console.info(`Set cookie: ${cookie}`);
    this.cookie = cookie;
  }

  /**
   * Cookieに含まれるJSESSIONIDを更新する
   *
   * ログインの前に別のリクエストが送信されており，Cookie内のJSESSIONIDが更新されている
   *
   * @returns {void}
   */
  private updateCookie(): void {
    const url: string = this.baseUrl + `cultos/reservge/gin_dsp_login?g_sessionid=${this.sessionId}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      // payload: { u_genzai_idx: 0 },
      headers: { Cookie: this.cookie },
      followRedirects: false,
    };
    console.info(`Send a request to: ${url}`, { options });
    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url, options);
    console.log(response.getContentText(config['charSet']));

    const responseHeader: ResponseHeaders = response.getHeaders();
    const cookie: string | undefined = responseHeader['Set-Cookie'];
    if (!cookie) throw new Error('Failed to get cookie');

    console.info(`Set cookie: ${cookie}`);
    this.cookie = cookie;
  }

  /**
   * テキストをパースする
   *
   * @param {string} input パース元の文字列
   * @param {string} keywordStart パース開始文字列
   * @param {string} keywordEnd パース終了文字列
   *
   * @returns {string} パース結果
   */
  private parseText(input: string, keywordStart: string, keywordEnd: string): string {
    const start: number = input.indexOf(keywordStart) + keywordStart.length;
    if (start < keywordStart.length) {
      // It means `(start - keywordStart.length) < 0`
      console.error(`Keyword '${keywordStart} not found.'`, {
        input,
        keyword: keywordStart,
      });
      throw Error(`Keyword '${keywordStart}' not found.`);
    }

    const end: number = input.indexOf(keywordEnd, start);
    if (end < 0) {
      console.error(`Keyword '${keywordEnd} not found.'`, {
        input,
        keyword: keywordEnd,
      });
      throw Error(`Keyword '${keywordEnd}' not found.`);
    }

    return input.substring(start, end);
  }
}
