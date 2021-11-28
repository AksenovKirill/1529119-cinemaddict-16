export const createFilmCardTemplate = (data) => {
  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">Popeye the Sailor Meets Sindbad the Sailor</h3>
    <p class="film-card__rating">${data.raiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">1936</span>
      <span class="film-card__duration">16m</span>
      <span class="film-card__genre">${data.genres}</span>
    </p>
    <img src="./images/posters/${data.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${data.description}</p>
    <span class="film-card__comments">${data.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button" >Mark as favorite</button>
  </div>
</article>`;
};
