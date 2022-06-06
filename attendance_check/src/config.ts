import { env } from './env';

type Config = {
  spreadsheet: {
    id: string;
  };
  form: {
    id: string;
  };
  calendar: {
    id: string;
    targetDay: number;
    keyword: string;
  };
  line: {
    webhookUrl: string;
    webhookToken: string;
  };
};

export const config: Config = {
  spreadsheet: {
    id: env['SHEET_ID'],
  },
  form: {
    id: env['FORM_ID'],
  },
  calendar: {
    id: env['CALENDAR_ID'],
    targetDay: 7,
    keyword: '練習',
  },
  line: {
    webhookUrl: 'https://notify-api.line.me/api/notify',
    webhookToken: env['LINE_WEBHOOK_TOKEN'],
  },
} as const;
