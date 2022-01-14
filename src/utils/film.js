export const sorters = {
  'date': (a,b) => b.year - a.year,
  'rating': (a,b) => b.rating - a.rating,
  'comments': (a, b) => b.comments.length - a.comments.length,
};

export const sortFilms = (film, sortType) => {
  if (sortType === 'rating') {
    return [...film].sort(sorters.rating);
  }
  if (sortType === 'date') {
    return [...film].sort(sorters.date);
  }
  if (sortType === 'default') {
    return film.slice(0,5);
  }
};
