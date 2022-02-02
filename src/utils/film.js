import { MINUTES } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getTime = (runtime) => {
  const dur = dayjs.duration({minutes: runtime}).format('mm');
  const hours = Math.floor(dur/MINUTES);
  const minutes = dur%MINUTES;
  return hours > 0 ? `${hours}h ${minutes}m` : `$${minutes}m`;
};

export const sliceText = (text, limit) => {
  text = text.trim();
  if( text.length <= limit) {
    return text;
  }
  text = text.slice(0, limit);
  return `${text.trim()}...`;
};
