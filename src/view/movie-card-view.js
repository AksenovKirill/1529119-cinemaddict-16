import AbstractView from './abstract-view.js';

const createFilmCardTemplate = (data) => (
  `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">Popeye the Sailor Meets Sindbad the Sailor</h3>
    <p class="film-card__rating">${data.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${data.year}</span>
      <span class="film-card__duration">16m</span>
      <span class="film-card__genre">${data.genre}</span>
    </p>
    <img src="./images/posters/${data.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${data.description}</p>
    <span class="film-card__comments">${data.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
</div>
</article>`
);

export default class FilmCardView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createFilmCardTemplate(this.#data);
  }

  setCardClickHandler = (callback) => {
    this._callback.cardClickCallback = callback;
    this.element.querySelector('.film-card__poster').addEventListener('click', this.#cardClickHandler);
    this.element.querySelector('.film-card__title').addEventListener('click', this.#cardClickHandler);
  }

  #cardClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.cardClickCallback();
  }

  setWatchListClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchListClickHadler);
  }

  #watchListClickHadler = (evt) => {
    evt.target.classList.toggle('film-card__controls-item--active');
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#favoriteClickHadler);
  }

  #favoriteClickHadler = (evt) => {
    evt.target.classList.toggle('film-card__controls-item--active');
  }

  setWatchedClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchedClickHadler);
  }

  #watchedClickHadler = (evt) => {
    evt.target.classList.toggle('film-card__controls-item--active');
  }
}
