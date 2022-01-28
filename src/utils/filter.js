import { FilterType } from '../const.js';

export const filter = {
  [FilterType.ALL_MOVIES]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export const generateFilter = (films) =>
  Object.entries(filter).map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }));
