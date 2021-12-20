export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

const cardFilters = {
  all: (cards) => cards.filter((card) => card.isAllMovies === true),
  watchList: (cards) => cards
    .filter((card) => card.isWatchList === true).length,
  history: (cards) => cards
    .filter((card) => card.isHistory === true).length,
  favorites: (cards) => cards
    .filter((card) => card.isFavorites === true).length,
};

export const sorters = {
  'date': (a,b) => b.year - a.year,
  'rating': (a,b) => b.raiting - a.raiting,
  'comments': (a, b) => b.comments.length - a.comments.length,
};

export const sortCards = (card, sortType) => {
  if (sortType === 'rating') {
    return [...card].sort(sorters.rating);
  }
  if (sortType === 'date') {
    return [...card].sort(sorters.date);
  }
  if (sortType === 'default') {
    return card.slice(0,5);
  }
};

export const generateFilter = (cards) => Object.entries(cardFilters).map(
  ([filterName, countCards]) => ({
    name: filterName,
    count: countCards(cards),
  }),
);
