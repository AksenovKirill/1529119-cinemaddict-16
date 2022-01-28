import { SortType } from '../const.js';

export const sorters = {
  date: (a, b) => b.year - a.year,
  rating: (a, b) => b.rating - a.rating,
  comments: (a, b) => b.comments.length - a.comments.length,
};

export const sortFilmsType = (film, sortType) => {
  if (sortType === SortType.RATING) {
    return film.sort(sorters.rating);
  }
  if (sortType === SortType.DATE) {
    return film.sort(sorters.date);
  }
  if (sortType === SortType.DEFAULT) {
    return film.slice(0, 5);
  }
};
