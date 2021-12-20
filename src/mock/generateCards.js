import dayjs from 'dayjs';
import {getRandomInteger, shuffle, getRandomFloat} from '../utils.js';

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
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
];

const generateDate = () => {
  const minGap = -30;
  const maxGap = 10;
  const daysGap = getRandomInteger(minGap, maxGap);
  return dayjs().add(daysGap, 'day').format('YYYY/MM/DD HH:mm');
};

const generateComment = () => {
  const comment = {
    emoji: emojis[0, getRandomInteger(0,emojis.length - 1)],
    date: generateDate(),
    user: userNames[0, getRandomInteger(0, userNames.length - 1)],
    message: 'Interesting setting and a good cast',
  };
  return comment;
};

export const generateFilmCard = () => ({
  poster: images[0, getRandomInteger(0, images.length - 1)],
  title: 'Popeye the Sailor Meets Sindbad the Sailor',
  rating: getRandomFloat(4, 9).toFixed(1),
  year: getRandomInteger(1930, 1955),
  genre:  shuffle(genres)[0, getRandomInteger(0, genres.length-1)],
  description: descriptions[0, getRandomInteger(0, descriptions.length - 1)],
  director: 'David Linch',
  screenwriter: 'Anne Wigton, Heinz Herald, Richard Weil',
  actors: 'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
  realeaseDate: generateDate(),
  runTime: '1h 18m',
  country: 'USA',
  ageRating: ageRaitings[0, getRandomInteger(0, ageRaitings.length - 1)],
  comments: Array.from({length: getRandomInteger(0, COMMENTS_COUNT)}, generateComment),
  isAllMovies: true,
  isWatchList: Boolean(getRandomInteger(0,1)),
  isHistory: Boolean(getRandomInteger(0,1)),
  isFavorites: Boolean(getRandomInteger(0,1)),
});
