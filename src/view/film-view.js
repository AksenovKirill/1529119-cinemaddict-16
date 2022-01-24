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

export default class FilmView extends AbstractView {
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
    this.element.addEventListener('click', this.#cardClickHandler);
  }

  #cardClickHandler = (evt) => {
    if (!(evt.target.closest('.film-card__controls'))) {
      this._callback.cardClick();
    }
  }

  setIsFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  setIsWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  }

  setIsWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if(evt.target.classList.contains('film-card__controls-item--favorite')) {
      this._callback.favoriteClick();
    }
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if(evt.target.classList.contains('film-card__controls-item--mark-as-watched')) {
      this._callback.watchedClick();
    }
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if(evt.target.classList.contains('film-card__controls-item--add-to-watchlist')) {
      this._callback.watchListClick();
    }
  }
}
