import AbstractView from './abstract-view.js';

const createTopRatedFilmCardTepmplate = (film) =>
  `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">The Man with the Golden Arm</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.year}</span>
        <span class="film-card__duration">1h 59m</span>
        <span class="film-card__genre">${film.genre}</span>
      </p>
      <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item
        film-card__controls-item--add-to-watchlist"
        type="button">
        Add to watchlist
      </button>
      <button class="film-card__controls-item
        film-card__controls-item--mark-as-watched"
        type="button">
        Mark as watched
      </button>
      <button class="film-card__controls-item
        film-card__controls-item--favorite"
        type="button">
        Mark as favorite
      </button>
    </div>
  </article>`;

export default class TopRatedFilmCardView extends AbstractView  {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createTopRatedFilmCardTepmplate(this.#film);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
    this.#film.isFavorite = !this.#film.isFavorite;
    this._callback.favoriteClick(this.#film);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
    this.#film.isHistory = !this.#film.isHistory;
    this._callback.watchedClick(this.#film);
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
    this.#film.isWatchList = !this.#film.isWatchList;
    this._callback.watchListClick(this.#film);
  }
}
