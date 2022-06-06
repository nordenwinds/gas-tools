import { env } from './env';

type Config = {
  baseUrl: string;
  charSet: string;
  identities: {
    youthHall: {
      id: string;
      password: string;
    };
  };
};

export const config: Config = {
  baseUrl: 'https://yoyaku.city.chigasaki.kanagawa.jp/',
  charSet: 'Shift-JIS',
  identities: {
    youthHall: {
      id: env['youthHallId'],
      password: env['youthHallPassword'],
    },
  },
} as const;
