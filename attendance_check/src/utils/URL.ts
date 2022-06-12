export class URL {
  public static buildQueryString(obj: { [key: string]: string }, encode = true): string {
    return Object.keys(obj)
      .map((key: string) => (encode ? `${key}=${encodeURIComponent(obj[key])}` : `${key}=${obj[key]}`))
      .join('&');
  }
}
