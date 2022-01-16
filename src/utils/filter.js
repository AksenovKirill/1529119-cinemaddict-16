import { FilterType } from '../const.js';

export const filmFilters = {
  [FilterType.ALL_MOVIES]: (films) => films.filter((film) => film.isAllMovies),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorites),
};

export const generateFilter = (films) =>
  Object.entries(filmFilters).map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }));
