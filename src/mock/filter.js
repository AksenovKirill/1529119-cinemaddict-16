const cardToFilter = {
  all: (cards) => cards.filter((card) => card.isAllMovies === true),
  watchList: (cards) => cards
    .filter((card) => card.isWatchList === true).length,
  history: (cards) => cards
    .filter((card) => card.isHistory === true).length,
  favorites: (cards) => cards
    .filter((card) => card.isFavorites === true).length,
};

export const generateFilter = (cards) => Object.entries(cardToFilter).map(
  ([filterName, countCards]) => ({
    name: filterName,
    count: countCards(cards),
  }),
);
