import SmartView from './smart-view';
import { getTime, sliceText } from '../utils/film.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const createFilmCardTemplate = (film) => {
  const {filmDate, runTime, description, genres, rating, title, poster, isHistory, isWatchList, isFavorite} = film;
  const date = dayjs(filmDate).format('YYYY');
  const filmRunTime = getTime(runTime);
  const descriptionFilm = sliceText(description, 139);

  return`<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${date}</span>
          <span class="film-card__duration">${filmRunTime}</span>
          <span class="film-card__genre">${genres.slice(0,1)}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${descriptionFilm}</p>
        <span class="film-card__comments">${film.comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item
          film-card__controls-item--add-to-watchlist ${isWatchList ? 'film-card__controls-item--active' : ''}"
          type="button">Add to watchlist
        </button>
        <button class="film-card__controls-item
          film-card__controls-item--mark-as-watched ${isHistory ? 'film-card__controls-item--active' : ''}"
          type="button">Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item
          film-card__controls-item--favorite ${isFavorite ? 'film-card__controls-item--active' : ''}"
          type="button">Mark as favorite
        </button>
      </div>
  </article>`;}

export default class FilmView extends SmartView {
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
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.cardClick();
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
    this._callback.favoriteClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchedClick();
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchListClick();
  }
}
