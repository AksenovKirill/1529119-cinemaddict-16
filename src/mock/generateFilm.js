import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, shuffle, getRandomFloat} from '../utils/common.js';

const COMMENTS_COUNT = 5;

export const emojis = ['angry.png', 'puke.png', 'sleeping.png', 'smile.png'];
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

const genres = [
  'Drama',
  'Film-Noir',
  'Mystery',
  'Action',
  'Comedy',
  'Fantasy',
  'Horror',
  'Romanc',
  'Thriller',
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

const generateDate = () => {
  const minGap = 10;
  const maxGap = 30;
  const gap = getRandomInteger(minGap, maxGap);
  return dayjs(`19${gap}`).add(gap, 'day').format('DD MMMM YYYY');
};

const generateDateComments = () => {
  const minGap = -30;
  const maxGap = 10;
  const daysGap = getRandomInteger(minGap, maxGap);
  return dayjs().add(daysGap, 'day').format('YYYY/MM/DD HH:mm');
};

const generateComment = () => {
  const comment = {
    emoji: emojis[0, getRandomInteger(0,emojis.length - 1)],
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
  date: generateDate(),
  genre:  shuffle(genres)[0, getRandomInteger(0, genres.length-1)],
  description: descriptions[0, getRandomInteger(0, descriptions.length - 1)],
  shortDescription: sliceText(descriptions[0, getRandomInteger(0, descriptions.length - 1)], 140),
  director: 'David Linch',
  screenwriter: 'Anne Wigton, Heinz Herald, Richard Weil',
  actors: 'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
  realeaseDate: generateDate(),
  runTime: `1h ${getRandomInteger(10,59)} m`,
  country: countries[0, getRandomInteger(0, countries.length - 1)],
  ageRating: ageRaitings[0, getRandomInteger(0, ageRaitings.length - 1)],
  comments: Array.from({length: getRandomInteger(0, COMMENTS_COUNT)}, generateComment),
  isAllMovies: true,
  isWatchList: Boolean(getRandomInteger(0,1)),
  isHistory: Boolean(getRandomInteger(0,1)),
  isFavorite: Boolean(getRandomInteger(0,1)),
  id: nanoid(),
});
