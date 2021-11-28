import dayjs from "dayjs";

const COMMENTS_COUNT = 5;
export const EMOJI = ['angry.png', 'puke.png', 'sleeping.png', 'smile.png'];
const AGE_RAITING = ['6 +', '10 +', '13 +', '16 +', '18 +'];

const userNames = [
  "Tim Macoveev",
  "Kirill Aksenov",
  "Rail Sakhaviev",
  "Elvis Presley",
];

const images = [
  "made-for-each-other.png",
  "popeye-meets-sinbad.png",
  "sagebrush-trail.jpg",
  "santa-claus-conquers-the-martians.jpg",
  "the-dance-of-life.jpg",
  "the-great-flamarion.jpg",
  "the-man-with-the-golden-arm.jpg",
];

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

export const getRandomNotAnInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1));
}

export const getRandomElements = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return array[index];
};

const getArrayRandomElements = (firstNumber, secondNumber, func) => {
  return Array.from(
    { length: getRandomInteger(firstNumber, secondNumber) },
    func
  );
};

const generateDescription = () => {
  const descriptions = [
    "Lorem ipsum dolor sit ametLorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.",
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateDate = () => {
  const minGap = -30;
  const maxGap = 10;
  const daysGap = getRandomInteger(minGap, maxGap);
  return dayjs().add(daysGap, "day").format('YYYY/MM/DD HH:mm');
};

const generateGenres = () => {
  const genres = [
    "Drama",
    "Film-Noir",
    "Mystery",
    "Action",
    "Comedy",
    "Fantasy",
    "Horror",
    "Romanc",
    "Thriller",
  ];
  return getRandomElements(genres);
};

const generateComment = () => {
  const comment = {
    emoji: getRandomElements(EMOJI),
    date: generateDate(),
    user: getRandomElements(userNames),
    message: "Interesting setting and a good cast",
  };
  return comment;
};

export const generateFilmCard = () => ({
  poster: getRandomElements(images),
  title: "Popeye the Sailor Meets Sindbad the Sailor",
  raiting: getRandomNotAnInteger(4, 9).toFixed(1),
  year: "1936",
  runTime: "1h 36m",
  genre: getArrayRandomElements(1, 1, generateGenres),
  description: generateDescription(),
  comments: getArrayRandomElements(0, COMMENTS_COUNT, generateComment),
});

export const generatePopupCard = () => ({
  poster: getRandomElements(images),
  title: "Popeye the Sailor Meets Sindbad the Sailor",
  raiting: getRandomNotAnInteger(4, 9).toFixed(1),
  director: "David Linch",
  screenwriter: "Anne Wigton, Heinz Herald, Richard Weil",
  actors: "Erich von Stroheim, Mary Beth Hughes, Dan Duryea",
  realeaseDate: generateDate(),
  runTime: "1h 18m",
  country: "USA",
  genre: getArrayRandomElements(1, 3, generateGenres),
  fullDescription: generateDescription(),
  ageRaiting: getRandomElements(AGE_RAITING),
  comments: getArrayRandomElements(0, COMMENTS_COUNT, generateComment),
});
