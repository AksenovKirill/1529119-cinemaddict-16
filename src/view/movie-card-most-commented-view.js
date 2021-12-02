export const createMostCommentedFilmCardTepmplate = (data) => (
  data.slice(0,2).map((card) =>`<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">Santa Claus Conquers the Martians</h3>
    <p class="film-card__rating">${card.raiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${card.year}</span>
      <span class="film-card__duration">1h 21m</span>
      <span class="film-card__genre">${card.genre}</span>
    </p>
    <img src="./images/posters/${card.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${card.description}</p>
    <span class="film-card__comments">${card.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
  </div>
</article>`)
);
