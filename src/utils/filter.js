import { FilterType } from '../const.js';

const filmFilters = {
  [FilterType.ALL_MOVIES]: (films) =>
    films.filter((film) => film.isAllMovies === true),
  [FilterType.WATCHLIST]: (films) =>
    films.filter((film) => film.isWatchList === true).length,
  [FilterType.HISTORY]: (films) =>
    films.filter((film) => film.isHistory === true).length,
  [FilterType.FAVORITES]: (films) =>
    films.filter((film) => film.isFavorites === true).length,
};

export const generateFilter = (films) =>
  Object.entries(filmFilters).map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }));
