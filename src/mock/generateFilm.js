import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomFloat} from '../utils/common.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const COMMENTS_COUNT = 5;

export const emojis = ['./images/emoji/smile.png', './images/emoji/puke.png', './images/emoji/sleeping.png', './images/emoji/smile.png'];
const ageRaitings = ['6 +', '10 +', '13 +', '16 +', '18 +'];

const userNames = [
  'Tim Macoveev',
  'Kirill Aksenov',
  'Rail Sakhaviev',
  'Elvis Presley',
];

const images = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const descriptions = [
  'Lorem ipsum dolor sit ametLorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
];

const countries = [
  'USA',
  'Canada',
  'Germany',
  'France',
  'Spain',
  'Russia',
  'Vietnam'
];

const generateGenre = () => {
  const genresCount = getRandomInteger(1, 3);
  const genres = [
    'action',
    'drama',
    'horror',
    'animation',
    'comedy',
    'historical',
    'adventure',
  ];
  return new Array(genresCount)
    .fill()
    .map(() => genres[getRandomInteger(0, genres.length - 1)]);
};

const getRandomDate = () => {
  const yearRandom = getRandomFloat(0, 0);
  const monthRandom = getRandomFloat(-11, 0);
  const dayRandom = getRandomFloat(-29, 0);
  const day = dayjs().add(yearRandom, 'year').add(monthRandom, 'month').add(dayRandom, 'day').toDate();
  return dayjs(day).format('DD MMMM YYYY');
};

const generateDateComments = () => {
  const dayRandom = getRandomInteger(-600, 0);
  const commentDate = dayjs().add(dayRandom, 'day').format('YYYY-MM-DD HH:mm:ss');
  return dayjs(commentDate).fromNow();
};

const generateComment = () => {
  const comment = {
    id: nanoid(),
    emoji: emojis[0, getRandomInteger(0, emojis.length - 1)],
    date: generateDateComments(),
    user: userNames[0, getRandomInteger(0, userNames.length - 1)],
    message: descriptions[0, getRandomInteger(0, descriptions.length - 1)],
  };
  return comment;
};

const sliceText = (text, limit) => {
  text = text.trim();
  if( text.length <= limit) {
    return text;
  }
  text = text.slice(0, limit);
  return `${text.trim()}...`;
};

export const generateFilm = () => ({
  poster: images[0, getRandomInteger(0, images.length - 1)],
  title: 'Popeye the Sailor Meets Sindbad the Sailor',
  rating: getRandomFloat(4, 9).toFixed(1),
  year: getRandomInteger(1930, 1955),
  date: dayjs(getRandomDate()),
  genres:  generateGenre(),
  description: descriptions[0, getRandomInteger(0, descriptions.length - 1)],
  shortDescription: sliceText(descriptions[0, getRandomInteger(0, descriptions.length - 1)], 140),
  director: 'David Linch',
  screenwriter: 'Anne Wigton, Heinz Herald, Richard Weil',
  actors: 'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
  realeaseDate: dayjs(getRandomDate()).format('DD MMMM YYYY'),
  runTime: getRandomInteger(60, 300),
  country: countries[0, getRandomInteger(0, countries.length - 1)],
  ageRating: ageRaitings[0, getRandomInteger(0, ageRaitings.length - 1)],
  comments: Array.from({length: getRandomInteger(0, COMMENTS_COUNT)}, generateComment),
  isWatchList: Boolean(getRandomInteger(0,1)),
  isHistory: Boolean(getRandomInteger(0,1)),
  isFavorite: Boolean(getRandomInteger(0,1)),
  id: nanoid(),
});
