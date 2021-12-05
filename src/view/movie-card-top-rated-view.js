import { createElement } from '../render.js';

const createTopRatedFilmCardTepmplate = (data) => (
`<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">The Man with the Golden Arm</h3>
      <p class="film-card__rating">${data.raiting}</p>
      <p class="film-card__info">
        <span class="film-card__year">${data.year}</span>
        <span class="film-card__duration">1h 59m</span>
        <span class="film-card__genre">${data.genre}</span>
      </p>
      <img src="./images/posters/${data.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${data.description}</p>
      <span class="film-card__comments">${data.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`)

export default class TopRatedFilmCardView {
  #element = null;
  #data = null;

  constructor(data) {
    this.#data = data;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createTopRatedFilmCardTepmplate(this.#data);
  }

  removeElement() {
    this.#element = null;
  }
}

