import moment from 'moment';
import { Location } from '../index';
import { Page } from 'puppeteer';

export const formatDate = (date: moment.MomentInput | string): string => {
  if (date === 'Present') {
    return moment().format()
  }

  return moment(date, 'MMMY').format()
}

export const getDurationInDays = (formattedStartDate: string, formattedEndDate: Date | string): number | null => {
  if (!formattedStartDate || !formattedEndDate) return null
  // +1 to include the start date
  return moment(formattedEndDate).diff(moment(formattedStartDate), 'days') + 1
}

export const getLocationFromText = (text: string): Location | null => {
  // Text is something like: Amsterdam Oud-West, North Holland Province, Netherlands

  if (!text) return null

  const cleanText = text.replace(' Area', '').trim();

  const parts = cleanText.split(', ');

  let city: null | string = null
  let province: null | string = null
  let country: null | string = null

  if (parts.length === 3) {
    city = parts[0]
    province = parts[1]
    country = parts[2]
  }

  if (parts.length === 2) {
    city = parts[0]
    country = parts[1]
  }

  if (parts.length === 1) {
    city = parts[0]
  }

  return {
    city,
    province,
    country
  }
}

export const getCleanText = (text: string | null) => {
  const regexRemoveMultipleSpaces = / +/g
  const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm

  if (!text) return null

  const cleanText = text
    .replace(regexRemoveLineBreaks, '')
    .replace(regexRemoveMultipleSpaces, ' ')
    .replace('...', '')
    .replace('See more', '')
    .replace('See less', '')
    .trim()

  return cleanText
}

export const statusLog = (section: string, message: string, scraperSessionId?: string | number) => {
  const sessionPart = (scraperSessionId) ? ` (${scraperSessionId})` : ''
  const messagePart = (message) ? `: ${message}` : null
  return console.log(`Scraper (${section})${sessionPart}${messagePart}`)
}

export const autoScroll = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 500;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export const getHostname = (url: string) => {
  return new URL(url).hostname;
};