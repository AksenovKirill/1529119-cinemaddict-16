import AbstractView from './abstract-view.js';

const createFilmCardTemplate = (film) =>
  `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">Popeye the Sailor Meets Sindbad the Sailor</h3>
        <p class="film-card__rating">${film.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${film.year}</span>
          <span class="film-card__duration">${film.runTime}</span>
          <span class="film-card__genre">${film.genre}</span>
        </p>
        <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${film.shortDescription}</p>
        <span class="film-card__comments">${film.comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item
          film-card__controls-item--add-to-watchlist ${film.isWatchList ? 'film-card__controls-item--active' : ''}"
          type="button">Add to watchlist
        </button>
        <button class="film-card__controls-item
          film-card__controls-item--mark-as-watched ${film.isHistory ? 'film-card__controls-item--active' : ''}"
          type="button">Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item
          film-card__controls-item--favorite ${film.isFavorite ? 'film-card__controls-item--active' : ''}"
          type="button">Mark as favorite
        </button>
      </div>
  </article>`;

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;

  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setCardClickHandler = (callback) => {
    this._callback.cardClick = callback;
    this.element.querySelector('.film-card__poster').addEventListener('click', this.#cardClickHandler);
    this.element.querySelector('.film-card__title').addEventListener('click', this.#cardClickHandler);
  }

  #cardClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.cardClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
  }
}
