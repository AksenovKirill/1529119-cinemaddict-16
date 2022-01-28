import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import {StatisticsFilterType} from '../const.js';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const filterStaticFilms = (films, dateTo, dateFrom, currentInput) => {
  if(currentInput === StatisticsFilterType.ALL_TIME){
    return films.filter((film) => dayjs(film.realeaseDate).isSameOrBefore(dayjs()));
  }
  if(currentInput === StatisticsFilterType.TODAY){
    return films.filter((film) => dayjs(film.realeaseDate).isSame(dateTo, 'day'));
  }
  if(currentInput === StatisticsFilterType.YEAR){
    return films.filter((film) => dayjs(film.realeaseDate).isBetween(dayjs().add(-365, 'day'), dayjs(), 'day'));
  }
  if(currentInput === StatisticsFilterType.MONTH){
    return films.filter((film) => dayjs(film.realeaseDate).isBetween(dayjs().add(-30, 'day'), dayjs(), 'day'));
  }
  if(currentInput === StatisticsFilterType.WEEK){
    return films.filter((film) => dayjs(film.realeaseDate).isBetween(dayjs().add(-7, 'day'), dayjs(), 'day'));
  }
  return films.filter((film) =>
    dayjs(film.realeaseDate).isSame(dateFrom , 'day') ||
    dayjs(film.realeaseDate).isBetween(dateFrom, dateTo) ||
    dayjs(film.realeaseDate).isSame(dateTo, 'day'),
  );
};

export const getWatchedFilmsForStatistics = (films, dateTo, dateFrom, currentInput) => {
  const watchedFilmsStat = {
    films: new Array(),
    genres: new Array(),
    filmsCountWithSameGenres: new Array(),
  };
  watchedFilmsStat.films = films.filter((film) => film.isHistory);
  films = films.filter((film) => film.isHistory);
  watchedFilmsStat.films = filterStaticFilms(films, dateTo, dateFrom, currentInput);
  const filmsGenres = [];
  watchedFilmsStat.films.filter((film) => filmsGenres.push(film.genres));
  watchedFilmsStat.genres = filmsGenres.flat().reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  return watchedFilmsStat;
};
