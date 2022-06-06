import { config } from '../config';
import { Scraper } from './scraper';

function handler(): void {
  const youthHallScraper = new Scraper(
    config['identities']['youthHall']['id'],
    config['identities']['youthHall']['password']
  );

  youthHallScraper.login();
}
