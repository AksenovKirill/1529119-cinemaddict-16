import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const statisticsPeriod = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const filterFilmsPeriod = (films, dateTo, dateFrom, currentInput) => {
  if(currentInput === statisticsPeriod.ALL_TIME){
    return films.filter((film) => dayjs(film.watchingDate).isSameOrBefore(dayjs()));
  }
  if(currentInput === statisticsPeriod.TODAY){
    return films.filter((film) => dayjs(film.watchingDate).isSame(dateTo, 'day'));
  }
  if(currentInput === statisticsPeriod.YEAR){
    return films.filter((film) => dayjs(film.watchingDate).isBetween(dayjs().add(-365, 'day'), dayjs(), 'day'));
  }
  if(currentInput === statisticsPeriod.MONTH){
    return films.filter((film) => dayjs(film.watchingDate).isBetween(dayjs().add(-30, 'day'), dayjs(), 'day'));
  }
  if(currentInput === statisticsPeriod.WEEK){
    return films.filter((film) => dayjs(film.watchingDate).isBetween(dayjs().add(-7, 'day'), dayjs(), 'day'));
  }
  return films.filter((film) =>
    dayjs(film.watchingDate).isSame(dateFrom , 'day') ||
    dayjs(film.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(film.watchingDate).isSame(dateTo, 'day'),
  );
};

export const getWatchedFilmsForStatistics = (films, dateTo, dateFrom, currentInput) => {
  const watchedFilmsStat = {
    films: new Array(),
    genres: new Array(),
    filmsCountWithSameGanres: new Array(),
  };
  watchedFilmsStat.films = films.filter((film) => film.isHistory);
  films = films.filter((film) => film.isHistory);
  watchedFilmsStat.films = filterFilmsPeriod(films, dateTo, dateFrom, currentInput);
  const filmsGenres = [];
  watchedFilmsStat.films.filter((film) => filmsGenres.push(film.genres));
  watchedFilmsStat.genres = filmsGenres.flat().reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  return watchedFilmsStat;
};
