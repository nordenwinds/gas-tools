type Env = {
  SHEET_ID: string;
  FORM_ID: string;
  CALENDAR_ID: string;
  LINE_WEBHOOK_TOKEN: string;
};

export const env: Env = {
  SHEET_ID: '',
  FORM_ID: '',
  CALENDAR_ID: '',
  LINE_WEBHOOK_TOKEN: '',
} as const;
